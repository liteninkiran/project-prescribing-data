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
