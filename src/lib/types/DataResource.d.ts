type DataResource = {
    repository: "${string}/${string}";
    dataType?: "githubTreeSource";
    // eslint-disable-next-line no-unused-vars
    handler?: (srcList: {
        [ file: string ]: string | Uint8Array;
    }) => void;
    files?: {
        [ file: string ]: string;
    };
    outDir?: string;
    branch?: string;
    filter?: RegExp;
};

type DataResourceList = {
    [ key: symbol ]: DataResource | string;
};

type GitTreeObject = {
    path: string,
    mode: number,
    type: string,
    sha: string,
    size: number,
    url: string;
};

export type FileHandlerParam = {
    [ key: string ]: string | Uint8Array;
};

export type FileHandler = (FileHandlerParam) => void;