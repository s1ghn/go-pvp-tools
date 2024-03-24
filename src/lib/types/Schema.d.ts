type ColumnType = "INTEGER" | "TEXT" | "REAL" | "BLOB" | "NUMERIC";

type Column = {
    name: string;
    type: ColumnType;
    primary?: boolean;
    notNull?: boolean;
    foreignKey?: string;
};

interface CSVParseableSchema {
    insertFromSource(srcFile: string): void;
}