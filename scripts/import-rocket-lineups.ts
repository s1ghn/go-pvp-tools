#!/usr/bin/env bun
/**
 * LeekDuck Rocket Lineups Importer
 * 
 * Fetches current Team GO Rocket lineups directly from LeekDuck.com
 * and saves them in a structured JSON format.
 * 
 * Source: https://leekduck.com/rocket-lineups/
 */

import { load, type CheerioAPI, type Element } from 'cheerio';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';

const LEEKDUCK_URL = 'https://leekduck.com/rocket-lineups/';
const OUTPUT_PATH = join(import.meta.dir, '../src/lib/data/rocket-lineups.json');
const GAME_MASTER_PATH = join(import.meta.dir, '../src/lib/data/game_master.json');

interface Pokemon {
  name: string;
  templateId?: string;
  type1: string;
  type2?: string;
  doubleWeaknesses: string[];
  singleWeaknesses: string[];
}

interface Slot {
  pokemon: Pokemon[];
}

interface RocketLineup {
  id: string;
  name: string;
  title: string;
  quote: string;
  photoUrl?: string;
  slots: {
    slot1: Slot;
    slot2: Slot;
    slot3: Slot;
  };
}

interface RocketData {
  lastUpdated: string;
  leekduckUpdated?: string;
  source: string;
  giovanni: RocketLineup | null;
  leaders: RocketLineup[];
  grunts: RocketLineup[];
}

/**
 * Fetch the LeekDuck rocket lineups page
 */
async function fetchLeekDuck(): Promise<string> {
  console.log('Fetching LeekDuck rocket lineups from', LEEKDUCK_URL);
  const response = await fetch(LEEKDUCK_URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; PokeTools/1.0)'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
  }
  
  return await response.text();
}

/**
 * Load game master for template ID matching
 */
async function loadGameMaster(): Promise<any[]> {
  try {
    const json = await readFile(GAME_MASTER_PATH, 'utf-8');
    return JSON.parse(json);
  } catch (e) {
    console.warn('Could not load game master, skipping template ID enrichment');
    return [];
  }
}

/**
 * Find Pokemon template ID in game master
 */
function findTemplateId(gameMaster: any[], pokemonName: string): string | undefined {
  const normalized = pokemonName
    .toUpperCase()
    .replace(/\s*\(.*\)/, '') // Remove form suffix like "(Incarnate)"
    .replace(/[^A-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
  
  // Try exact match first
  const exactMatch = gameMaster.find((entry: any) => {
    const tid = entry.templateId || '';
    return tid === `V${normalized}_POKEMON_${normalized}` ||
           tid === `V0001_POKEMON_${normalized}` ||
           tid.includes(`_POKEMON_${normalized}`);
  });
  
  if (exactMatch) return exactMatch.templateId;
  
  // Try partial match
  const partialMatch = gameMaster.find((entry: any) => {
    const tid = (entry.templateId || '').toUpperCase();
    return tid.includes('_POKEMON_') && tid.includes(normalized);
  });
  
  return partialMatch?.templateId;
}

/**
 * Parse Pokemon from a shadow-pokemon element
 */
function parsePokemon($: CheerioAPI, element: Element, gameMaster: any[]): Pokemon {
  const $el = $(element);
  const name = $el.attr('data-pokemon') || 'Unknown';
  const type1 = $el.attr('data-type1') || '';
  const type2 = $el.attr('data-type2');
  const doubleWeaknesses = ($el.attr('data-double-weaknesses') || '')
    .split(',')
    .filter(Boolean);
  const singleWeaknesses = ($el.attr('data-single-weaknesses') || '')
    .split(',')
    .filter(Boolean);
  
  const pokemon: Pokemon = {
    name,
    type1,
    doubleWeaknesses,
    singleWeaknesses
  };
  
  if (type2 && type2 !== 'None') {
    pokemon.type2 = type2;
  }
  
  // Try to find template ID
  const templateId = findTemplateId(gameMaster, name);
  if (templateId) {
    pokemon.templateId = templateId;
  }
  
  return pokemon;
}

/**
 * Parse a rocket profile into a lineup object
 */
function parseRocketProfile($: CheerioAPI, element: Element, gameMaster: any[]): RocketLineup {
  const $profile = $(element);
  
  const name = $profile.find('.name').first().text().trim();
  const title = $profile.find('.title').first().text().trim();
  const quote = $profile.find('.quote-text').first().text().trim();
  const photoUrl = $profile.find('.photo img').attr('src');
  
  const slots: Slot[] = [
    { pokemon: [] },
    { pokemon: [] },
    { pokemon: [] }
  ];
  
  $profile.find('.slot').each((idx, slotEl) => {
    const $slot = $(slotEl);
    const slotNum = parseInt($slot.find('.number').text().trim()) - 1;
    
    if (slotNum >= 0 && slotNum < 3) {
      $slot.find('.shadow-pokemon').each((_, pokemonEl) => {
        const pokemon = parsePokemon($, pokemonEl, gameMaster);
        slots[slotNum].pokemon.push(pokemon);
      });
    }
  });
  
  const id = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  
  return {
    id,
    name,
    title,
    quote,
    photoUrl,
    slots: {
      slot1: slots[0],
      slot2: slots[1],
      slot3: slots[2]
    }
  };
}

/**
 * Parse the full HTML and extract all lineups
 */
function parseLineups(html: string, gameMaster: any[]): RocketData {
  const $ = load(html);
  
  // Extract last updated date from page
  const dateText = $('time').attr('datetime') || '';
  
  const data: RocketData = {
    lastUpdated: new Date().toISOString(),
    leekduckUpdated: dateText,
    source: LEEKDUCK_URL,
    giovanni: null,
    leaders: [],
    grunts: []
  };
  
  // Parse each rocket profile
  $('.rocket-profile').each((_, element) => {
    const lineup = parseRocketProfile($, element, gameMaster);
    
    // Categorize based on title
    const titleLower = lineup.title.toLowerCase();
    const nameLower = lineup.name.toLowerCase();
    
    if (nameLower.includes('giovanni') || titleLower.includes('boss')) {
      data.giovanni = lineup;
    } else if (titleLower.includes('leader') || 
               nameLower.includes('cliff') || 
               nameLower.includes('arlo') || 
               nameLower.includes('sierra')) {
      data.leaders.push(lineup);
    } else {
      data.grunts.push(lineup);
    }
  });
  
  return data;
}

/**
 * Main import function
 */
async function main() {
  try {
    console.log('🚀 Starting LeekDuck Rocket Lineups import...\n');
    
    // Load game master for template ID enrichment
    const gameMaster = await loadGameMaster();
    console.log(`📚 Loaded ${gameMaster.length} game master entries\n`);
    
    // Fetch and parse LeekDuck
    const html = await fetchLeekDuck();
    console.log(`📄 Fetched ${html.length} bytes of HTML\n`);
    
    const data = parseLineups(html, gameMaster);
    
    // Save to file
    console.log('💾 Saving to', OUTPUT_PATH);
    await writeFile(OUTPUT_PATH, JSON.stringify(data, null, 2), 'utf-8');
    
    console.log('\n✅ Import complete!');
    console.log(`📅 LeekDuck last updated: ${data.leekduckUpdated}`);
    console.log(`👔 Giovanni: ${data.giovanni ? '✓' : '✗'}`);
    console.log(`🎖️  Leaders: ${data.leaders.length}`);
    console.log(`👊 Grunts: ${data.grunts.length}`);
    
    if (data.giovanni) {
      console.log(`\n🔴 Giovanni's lineup:`);
      console.log(`   Slot 1: ${data.giovanni.slots.slot1.pokemon.map(p => p.name).join(', ')}`);
      console.log(`   Slot 2: ${data.giovanni.slots.slot2.pokemon.map(p => p.name).join(', ')}`);
      console.log(`   Slot 3: ${data.giovanni.slots.slot3.pokemon.map(p => p.name).join(', ')}`);
    }
    
    if (data.leaders.length > 0) {
      console.log(`\n🎖️  Leaders:`);
      data.leaders.forEach(leader => {
        console.log(`   ${leader.name}: ${leader.slots.slot1.pokemon.map(p => p.name).join('/')}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

main();
