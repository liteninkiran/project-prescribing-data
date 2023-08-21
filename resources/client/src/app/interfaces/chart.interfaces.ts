export interface IChartMargins {
    top: number;
    right: number;
    bottom: number;
    left: number;
};

export interface ICountryCode {
    location: string;
    iso3: string;
};

export interface IMapData {
    title: string;
    data: IMapDataElement[];
    thresholds: Array<number>;
};

export interface IMapDataElement {
    id: string;
    value: number;
    date: number;
};

export interface IMapConfig {
    margins: IChartMargins;
    title: {
        fontWeight: string;
        fontSize: number;
    };
    features: {
        base: {
            stroke: string;
            fill: string;
        };
        data: {
            stroke: string;
        };
        highlighted: {
            stroke: string;
        };
    };
    faded: {
        opacity: number;
    };
    noData: {
        colour: string;
        label: string;
    };
    legend: {
        width: number;
        height: number;
        fontSize: number;
        noDataSeparator: number;
    };
    colours: string[];
};

export interface IMapContainer {
    countries: any;
    data: any;
    titleContainer: any;
    legend: any;
};

export interface IMapFeature {
    geometry: {
        coordinates: any;
        type: string;
    };
    id: string;
    properties: {
        CNTR_ID: string;
        CNTR_NAME: string;
        FID: string;
        ISO3_CODE: string;
        NAME_ENGL: string;
    };
    type: string;
};

export interface ITooltipState {
    visible: boolean;
    x: number;
    y: number;
}

export interface ITimelineData {
    title: string;
    activeTime: number;
    data: IMapDataElement[];
    timeFormat: string;
}

export interface ITimelineConfig {
    margins: IChartMargins;
    dimensions: {
        width: number;
        height: number;
    };
    background: {
        colour: string;
    };
    title: {
        fontSize: number;
        fontWeight: string;
    };
    labels: {
        fontSize: number;
    };
    line: {
        stroke: string;
    };
    area: {
        fill: string;
        opacity: number;
    };
    axis: {
        colour: string;
    };
    circle: {
        stroke: string;
        fill: string;
        radius: number;
    };
    values: {
        decimalPlaces: number;
        xPadding: number;
        yPadding: number;
    };
}
