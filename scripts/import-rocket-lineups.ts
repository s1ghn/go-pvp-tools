#!/usr/bin/env bun
/**
 * LeekDuck Rocket Lineups Importer
 * 
 * Fetches current Team GO Rocket lineups from LeekDuck and saves them
 * in a structured JSON format with game master data references.
 */

import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';

const POGOINFO_GRUNTS_URL = 'https://raw.githubusercontent.com/ccev/pogoinfo/v2/active/grunts.json';
const LEEKDUCK_URL = 'https://leekduck.com/rocket-lineups/';
const OUTPUT_PATH = join(import.meta.dir, '../src/lib/data/rocket-lineups.json');
const GAME_MASTER_PATH = join(import.meta.dir, '../src/lib/data/game_master.json');

interface PokemonSlot {
  pokemon: string[];
}

interface RocketLineup {
  id: string;
  name: string;
  title: string;
  quote: string;
  type?: string;
  gender?: 'male' | 'female';
  slots: {
    slot1: PokemonSlot;
    slot2: PokemonSlot;
    slot3: PokemonSlot;
  };
}

interface RocketData {
  lastUpdated: string;
  source: string;
  giovanni: RocketLineup | null;
  leaders: RocketLineup[];
  grunts: RocketLineup[];
}

/**
 * Fetch rocket lineup data from PogoInfo
 */
async function fetchPogoInfoGrunts(): Promise<any> {
  console.log('Fetching PogoInfo grunt data...');
  const response = await fetch(POGOINFO_GRUNTS_URL);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
}

/**
 * Convert PogoInfo Pokemon format to readable names
 */
function formatPokemonFromPogoInfo(pokemon: any, gameMaster: any[]): string {
  if (typeof pokemon === 'string') return pokemon;
  
  const template = pokemon.template || '';
  
  // Try to find readable name in game master
  const gmEntry = gameMaster.find((entry: any) => entry.templateId === template);
  if (gmEntry) {
    return gmEntry.templateId;
  }
  
  return template;
}

/**
 * Parse PogoInfo data into our format
 */
function parsePogoInfoLineups(pogoData: any, gameMaster: any[]): RocketData {
  const data: RocketData = {
    lastUpdated: new Date().toISOString(),
    source: POGOINFO_GRUNTS_URL,
    giovanni: null,
    leaders: [],
    grunts: []
  };
  
  // Iterate through all grunts
  Object.entries(pogoData).forEach(([id, gruntData]: [string, any]) => {
    if (!gruntData.active || !gruntData.lineup) return;
    
    const character = gruntData.character;
    const lineup = gruntData.lineup;
    
    // Skip non-rocket characters
    if (!character.template?.includes('GRUNT') && 
        !character.template?.includes('GIOVANNI') &&
        !character.template?.includes('EXECUTIVE')) {
      return;
    }
    
    // Extract Pokemon for each slot
    const slots: PokemonSlot[] = [
      { pokemon: [] },
      { pokemon: [] },
      { pokemon: [] }
    ];
    
    if (lineup.team && Array.isArray(lineup.team)) {
      lineup.team.forEach((slot: any, idx: number) => {
        if (idx >= 3 || !Array.isArray(slot)) return;
        
        slots[idx].pokemon = slot.map((pokemon: any) => 
          formatPokemonFromPogoInfo(pokemon, gameMaster)
        );
      });
    }
    
    // Determine type
    let type: string | undefined;
    if (character.type && character.type.name) {
      type = character.type.name.toLowerCase();
    }
    
    // Build readable name
    let name = character.template
      .replace(/CHARACTER_/, '')
      .replace(/_/g, ' ')
      .toLowerCase()
      .split(' ')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    const rocketLineup: RocketLineup = {
      id: character.template.toLowerCase(),
      name,
      title: 'Team GO Rocket',
      quote: '',
      type,
      gender: character.gender === 1 ? 'male' : character.gender === 0 ? 'female' : undefined,
      slots: {
        slot1: slots[0],
        slot2: slots[1],
        slot3: slots[2]
      }
    };
    
    // Categorize
    if (character.template.includes('GIOVANNI')) {
      rocketLineup.title = 'Team GO Rocket Boss';
      data.giovanni = rocketLineup;
    } else if (character.template.includes('EXECUTIVE')) {
      rocketLineup.title = 'Team GO Rocket Leader';
      data.leaders.push(rocketLineup);
    } else {
      rocketLineup.title = 'Team GO Rocket Grunt';
      if (type) {
        rocketLineup.name = `${type.charAt(0).toUpperCase() + type.slice(1)}-type ${character.gender === 1 ? 'Male' : 'Female'} Grunt`;
      }
      data.grunts.push(rocketLineup);
    }
  });
  
  return data;
}

/**
 * Main import function
 */
async function main() {
  try {
    console.log('Starting Rocket Lineups import...\n');
    
    // Load game master for enrichment
    console.log('Loading game master data...');
    const gameMasterJson = await readFile(GAME_MASTER_PATH, 'utf-8');
    const gameMaster = JSON.parse(gameMasterJson);
    console.log(`Loaded ${gameMaster.length} game master entries\n`);
    
    // Fetch and parse from PogoInfo
    const pogoData = await fetchPogoInfoGrunts();
    const data = parsePogoInfoLineups(pogoData, gameMaster);
    
    // Save to file
    console.log('\nSaving to', OUTPUT_PATH);
    await writeFile(OUTPUT_PATH, JSON.stringify(data, null, 2), 'utf-8');
    
    console.log('\n✅ Import complete!');
    console.log(`- Giovanni: ${data.giovanni ? '✓' : '✗'}`);
    console.log(`- Leaders: ${data.leaders.length}`);
    console.log(`- Grunts: ${data.grunts.length}`);
    
    if (data.giovanni) {
      console.log(`\nGiovanni lineup:`);
      console.log(`  Slot 1: ${data.giovanni.slots.slot1.pokemon.join(', ')}`);
      console.log(`  Slot 2: ${data.giovanni.slots.slot2.pokemon.join(', ')}`);
      console.log(`  Slot 3: ${data.giovanni.slots.slot3.pokemon.join(', ')}`);
    }
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

main();
