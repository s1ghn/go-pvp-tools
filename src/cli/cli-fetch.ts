import fetchResources from "./data-sources";
import path from "path";
import { program } from "commander";
import { writeToFile } from "./file-handlers";

export default program
    .argument("<handler>", "only fetch data for a specific handler")
    .action(async (options) => {
        fetchData(options);
    })
    .parse(process.argv);

async function fetchData(handler: keyof typeof fetchResources) {
    for (const i in fetchResources) {
        let writeToDir = __dirname + "/../lib/data";

        // skip when handler is set and not matching
        if (handler && i !== handler) {
            continue;
        }

        const fileSource = fetchResources[ i as keyof typeof fetchResources ] as DataResource | string;

        let fileList: {
            [ file: string ]: string;
        } = {};

        // string types: only have filename and url
        if (typeof fileSource === "string") {
            fileList[ i ] = fileSource;
        }

        // handle data types
        if (fileSource instanceof Object) {
            // get files from github tree
            if (fileSource?.dataType === "githubTreeSource") {
                fileList = await getFilesFromGithubTree(fileSource);
            }

            // or from files object
            else if (fileSource.files) {
                fileList = fileSource.files;
            }

            // outDir changes the default write location
            if (fileSource.outDir) {
                writeToDir = fileSource.outDir;
            }
        }

        // download files specified in file list
        const contentList: {
            [ file: string ]: string | Uint8Array;
        } = {};

        for (const fi in fileList) {
            console.log(`fetching ${fi} ...`);
            const response = await fetch(fileList[ fi ]);

            // get original file ending
            const ext = path.parse(fileList[ fi ]).ext;

            if (!response.ok) {
                throw new Error(`failed to fetch ${fileList[ fi ]}`);
            }

            // load an image?
            const contentType = response.headers.get('content-type');
            const data: Uint8Array | string = contentType?.includes("text") || contentType?.includes("json")
                ? await response.text()
                : new Uint8Array(await response.arrayBuffer());

            contentList[ fi ] = data;

            // write to file if no handler
            // default is .json
            if (typeof fileSource === "object" && !fileSource.handler || typeof fileSource === "string") {
                writeToFile(data, path.join(writeToDir, fi + ext));
            }
        }

        // handle handler
        // abort further processing if handler is set
        if (typeof fileSource === "object" && fileSource.handler) {
            fileSource.handler(contentList);
        }
    }

    console.log("DONE");
}

// function csvToJson(csv: string) {
//     const lines = csv.split("\n");
//     const result = [];
//     const headers = lines[ 0 ].split(",");
//     for (let i = 1; i < lines.length; i++) {
//         const obj: { [ key: string ]: string; } = {};
//         const currentline = lines[ i ].split(",");
//         for (let j = 0; j < headers.length; j++) {
//             obj[ headers[ j ] ] = currentline[ j ];
//         }
//         result.push(obj);
//     }
//     return JSON.stringify(result);
// }

async function getFilesFromGithubTree(fileSource: DataResource) {
    const branch = fileSource.branch || "master";
    const response = await fetch(`https://api.github.com/repos/${fileSource.repository}/git/trees/${branch}?recursive=1`);
    if (!response.ok) {
        throw new Error(`failed to fetch ${fileSource.repository}`);
    }

    const data = await response.json() as { tree: GitTreeObject[]; };
    const files: {
        [ file: string ]: string;
    } = {};

    for (const file of data.tree) {
        const url = file.path;

        // must match filter if set
        if (fileSource.filter && url.match(fileSource.filter) === null) {
            continue;
        }

        const final = `https://raw.githubusercontent.com/${fileSource.repository}/master/${url}`;

        files[ path.parse(url).name ] = final;
    }

    return files;
}