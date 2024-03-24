import Database from "$lib/server/Database";

export default abstract class Schema {
    public db = Database;

    /**
     * The name of the table
     */
    public abstract name: string;

    /**
     * The columns of the table
     */
    public abstract columns: Column[];
}

export abstract class CSVImportableSchema extends Schema {
    public insertFromSource(srcFile: string): void {
        // first row is always the header, can be stripped
        const src = srcFile.replace(/.*\n/, "");
        let statement = "BEGIN TRANSACTION;\n";

        const rows = src.split("\n");
        for (const row of rows) {
            const values = row.split(",");
            statement += `INSERT INTO ${this.name} VALUES (${values.join(", ")});\n`;
        }

        statement += "COMMIT;";
        this.db.exec(statement);
    }
}