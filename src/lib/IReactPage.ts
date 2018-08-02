
export type fetchParams = { 
    url: Map<string, string>,
    query: Map<string, string>
};

export interface IReactPage {

    configure?: Function;

    title?: string;

    urlTemplate?: string;
    
    fetchData?: (store: any, data: fetchParams) => Promise<any>;
}