export interface IRole {
    id: number;
    _id: string;
    code: string;
    display_name: string;
    primary_role: boolean;
    created_at: Date;
    updated_at: Date;
};

export interface IPagedList {
    current_page: number;
    data: any[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: IPagedListLinks[];
    next_page_url: string;
    path: string;
    per_page: number;
    prev_page_url: string;
    to: number;
    total: number;
};

export interface IPagedListLinks {
    active: boolean;
    label: string;
    url: string;
};

export interface IColumnConfig {
    columnId: string;
    columnName: string;
    visible: boolean;
};
