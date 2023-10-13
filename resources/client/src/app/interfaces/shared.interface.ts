export interface IMatTableColumnConfig {
    columnId: string;
    columnName: string;
    visible: boolean;
    property?: string;
};

export interface IFilterConfig {
    field: string;
    value: any;
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

export interface ICheckboxMenuItem {
    label: string;
    value: string | number;
    formControlName: string;
    checked: boolean;
}

export interface IAsyncButtonInputConfig {
    buttonText: string;
    colour: '' | 'primary' | 'accent' | 'warn';
    icon: string;
    loaded: boolean;
    hide?: boolean;
    hideRow: string;
}

export interface IPaginatorConfig {
    pageSizeOptions: number[],
    intialPageSize: number,
    showFirstLastButtons: boolean,
    hidePageSize: boolean,
    disabled: boolean,
}

export interface IMatSelectOptions {
    id: number;
    name: string;
    code?: string | null;
    icon?: string | null;
};

export interface IMapData {
    id: number;
    code?: string;
    name: string;
    icon: string | null;
    icon_name: string | null;
    postcode: string | null;
    lat: number | null;
    long: number | null;
    tooltipText: string;
};
