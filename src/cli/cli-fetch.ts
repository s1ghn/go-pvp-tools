import fetchResources from "$lib/data/data-sources";
import path from "path";
import fs from "fs";
import { program } from "commander";

const writeToDir = __dirname + "/../../static/data";

export default program
    .option("-r, --refresh", "reload already fetched data")
    .action(async (options) => {
        fetchData(options);
    })
    .parse(process.argv);

async function fetchData(options: { refresh: boolean; }) {
    for (const i in fetchResources) {
        const fileSource = fetchResources[ i as keyof typeof fetchResources ] as DataResource | string;

        // skip if file / folder exists and not refreshing
        if (!options.refresh && (
            fs.existsSync(path.join(writeToDir, i))
            || fs.existsSync(path.join(writeToDir, i + ".json"))
        )) {
            console.log(`skipping ${i} - exists`);
            continue;
        }

        // handle data types
        if (fileSource instanceof Object) {
            if (fileSource.dataType === "githubTreeSource") {
                await downloadFolderFromGithub(i, fileSource);
            }

            continue;
        }

        const url = fileSource;
        const fileExtension = url.match(/\.([a-z]+)$/)?.[ 1 ];

        console.log(`fetching ${i} ...`);

        // fetch data from url
        const response = await fetch(url, {

        });

        // skip and report on error or status != 200
        if (!response.ok) {
            throw new Error(`failed to fetch ${url}`);
        }

        let data = await response.text();

        // convert CSV to JSON if file extension is .csv
        if (fileExtension === "csv") {
            data = csvToJson(data);
        }

        // write to file
        const filePath = path.join(writeToDir, i + ".json");

        // write to file, create missing folders along the way
        if (!fs.existsSync(writeToDir)) {
            fs.mkdirSync(writeToDir, { recursive: true });
        }
        fs.writeFileSync(filePath, data);
    }

    console.log("DONE");
}

function csvToJson(csv: string) {
    const lines = csv.split("\n");
    const result = [];
    const headers = lines[ 0 ].split(",");
    for (let i = 1; i < lines.length; i++) {
        const obj: { [ key: string ]: string; } = {};
        const currentline = lines[ i ].split(",");
        for (let j = 0; j < headers.length; j++) {
            obj[ headers[ j ] ] = currentline[ j ];
        }
        result.push(obj);
    }
    return JSON.stringify(result);
}

async function downloadFolderFromGithub(folderName: string, fileSource: DataResource) {
    const response = await fetch(`https://api.github.com/repos/${fileSource.repository}/git/trees/master?recursive=1`);
    if (!response.ok) {
        throw new Error(`failed to fetch ${fileSource.repository}`);
    }

    const data = await response.json() as { tree: GitTreeObject[]; };

    for (const file of data.tree) {
        const url = file.path;

        // must match filter if set
        if (fileSource.filter && url.match(fileSource.filter) === null) {
            continue;
        }

        console.log(`fetching ${url} ...`);

        const fileName = file.path.split("/").pop() as string;
        const downloadUrl = `https://raw.githubusercontent.com/${fileSource.repository}/master/${url}`;
        const response = await fetch(downloadUrl);
        if (!response.ok) {
            throw new Error(`failed to fetch ${downloadUrl}`);
        }

        const data = await response.arrayBuffer();
        const filePathPrefix = path.join(writeToDir, folderName);
        const filePath = path.join(writeToDir, folderName, fileName);

        if (!fs.existsSync(filePathPrefix)) {
            fs.mkdirSync(filePathPrefix, { recursive: true });
        }

        fs.writeFileSync(filePath, Buffer.from(data));
    }
}