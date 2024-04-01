import { program } from "commander";

import packageJson from "../../package.json" assert { type: "json" };

export default program
    .version(packageJson.version)
    .description(packageJson.description)
    .command("fetch", "fetch data from original sources")
    .parse();