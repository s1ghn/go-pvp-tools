import type { DataResource, FileHandlerParam } from "$lib/types/DataResource";
import { writeToFile } from "../file-handlers";

export default function csvToJson(list: FileHandlerParam, config: DataResource): void {
    for (const i in list) {
        // list of file content that is csv 
        // should be written to filename which is the key
        // to the config.outDir
        const content = list[ i ] as string;
        const filename = `${config.outDir}/${i}.json`;

        // write to json object, first line being the names of the columns
        const lines = content.split("\n");
        const headers = lines[ 0 ].split(",");
        const json = lines.slice(1).map((line) => {
            const obj: { [ key: string ]: string; } = {};
            // strip every non utf-8 character
            const cleanedHeader = headers.map((h) => h.replace(/[^\x00-\x7F]/g, ""));
            line.split(",").forEach((col, idx) => {
                obj[ cleanedHeader[ idx ] ] = col;
            });
            return obj;
        });

        // write to file
        writeToFile(JSON.stringify(json), filename);
    }
};