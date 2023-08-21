import { ICountryCode, IMapData, IMapDataElement, ITimelineData, ITooltipState } from 'src/app/interfaces/chart.interfaces';
import { MapTooltipActions, MapTooltipActionsTypes, ShowMapTooltip } from './map-tooltip.actions';
import * as d3 from 'd3';

export class MapHelper {

    public fullDataSet: IMapDataElement[] = [];
    public dataByDate = new Map<number, IMapDataElement[]>();
    public dataByCountry = new Map<string, IMapDataElement[]>();
    public countriesById = new Map<string, string>();
    public currentDate = 0;
    public dateRange: [number, number] = [0, 1];
    public data: IMapData = {
        title: 'Geo Data',
        data: [],
        thresholds: [],
    };
    public tooltipState: ITooltipState = {
        visible: false,
        x: 0,
        y: 0,
    };
    public tooltipData: ITimelineData = {
        title: '',
        activeTime: 0,
        data: [],
        timeFormat: '',
    };

    private timeFormatString = '%d %B %Y';
    private timeFormat = d3.timeFormat(this.timeFormatString);

    public setData(data: any, countryCodes: Array<ICountryCode>, dataAttr: string = 'new_deaths_smoothed_per_million'): void {
        const ids: Map<string, string> = new Map(countryCodes.map((code: ICountryCode) => [code.location, code.iso3]));
        this.countriesById = new Map(countryCodes.map((code: ICountryCode) => [code.iso3, code.location]));
        this.fullDataSet = data.location.map((location: string, i: number) => ({
            id: ids.get(location) || '',
            value: (data as any)[dataAttr][i],
            date: this.parseDate(data.date[i]),
        }));
        this.dataByDate = d3.group(this.fullDataSet as any, (d: any) => d.date) as any;
        this.dataByCountry = d3.group(this.fullDataSet, (d: any) => d.id);
        this.dateRange = d3.extent(this.fullDataSet, (d: any) => d.date) as [number, number];
        this.setMapData(this.dateRange[1]);
    }

    public tooltip = (action: MapTooltipActions) => {
        switch(action.type) {
            case MapTooltipActionsTypes.showTooltip:
                this.showTooltip(action);
                break;
            case MapTooltipActionsTypes.hideTooltip:
                this.hideTooltip();
                break;
        }
    }

    public showTooltip(action: ShowMapTooltip): void {
        // Set position
        // Set visible to true
        this.tooltipState = {
            visible: true,
            x: action.payload.x - 125,
            y: action.payload.y - 170,
        };
        // Set data
        this.setTooltipData(action.payload.id);
    }

    public hideTooltip(): void {
        // Set position
        this.tooltipState = {
            visible: false,
            x: 0,
            y: 0,
        };
        // Set visible to false
    }

    public setTooltipData(id: string) {
        this.tooltipData = {
            title: this.countriesById.get(id) || '',
            activeTime: this.currentDate,
            data: this.dataByCountry.get(id) || [],
            timeFormat: this.timeFormatString,
        };
    }

    public setMapData(date: number): void {
        this.currentDate = date;
        this.data = {
            title: this.data.title,
            data: this.dataByDate.get(date) as any,
            thresholds: [null as any, 0, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20],
        };
    }

    private parseDate(date: string): number {
        return Date.parse(date);
    }
}
