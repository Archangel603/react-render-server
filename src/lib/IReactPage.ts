
export type fetchParams = { 
    url: Map<string, string>,
    query: Map<string, string>
};

export interface IPageMetaData {
    title: string;
    keywords: string;
    description: string;
}

export interface IPageRequisites {
    urlPattern: string;
}

export interface IPageModel {

    getMetaData: () => IPageMetaData;

    getRequisites: () => IPageRequisites;

    fillStore?: (store: any, data: fetchParams) => Promise<any>;

}

export interface IReactPage {

    configure?: Function;

    getModel: () => IPageModel;
    
}