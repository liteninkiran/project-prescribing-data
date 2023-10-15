import { IOrganisation } from "src/app/interfaces/organisation.interface";
import { defaultIcon } from "../shared/map/map.component";
import { IMapData } from "src/app/interfaces/shared.interface";
import { DecimalPipe } from "@angular/common";
import { Injectable } from "@angular/core";

@Injectable()
export class OrganisationHelperService {

    constructor(
        private _decimalPipe: DecimalPipe,
    ) { }

    public orgToMapData = (org: IOrganisation): IMapData => {
        return {
            id: org.id,
            icon: org.primary_role.icon || null,
            icon_name: org.primary_role.display_name,
            lat: org.postcode?.latitude || null,
            long: org.postcode?.longitude || null,
            code: org.org_id,
            name: org.name,
            postcode: org.post_code,
            tooltipText: this.getTooltipText(org),
        }
    }

    public getFilterMessage = (total: number, limit: number, limit_exceeded: boolean, mapDataCount: number = -1): string => {
        const totalStr = this._decimalPipe.transform(mapDataCount === -1 ? total : mapDataCount, '1.0-0');
        const limitStr = this._decimalPipe.transform(mapDataCount === -1 ? limit : mapDataCount, '1.0-0');
        const warning = '<strong>Please restrict your query using the filters</strong>';
        let message = 'Showing ';
        if (limit_exceeded) {
            message += limitStr + ' of ' + totalStr + ' items ' + warning;
        } else {
            message += totalStr + ' items';
        }
        return message;
    }

    private getTooltipText(org: IOrganisation): string {
        return `
            <div>
                <div style="display: flex;">
                    <div style="margin-right: 15px;">
                        <img style="display: inline-block; height: 40px; width: 40px; margin-top: 4px;" src="${org.primary_role.icon || defaultIcon.iconUrl}">
                    </div>
                    <div style="text-align: left; min-width: 200px; display: flex; align-items: center;">
                        <h2 style="margin-top: 0; margin-bottom: 0; white-space: normal; color: royalblue;">${org.primary_role.display_name}</h2>
                    </div>
                </div>
                <div style="white-space: normal;">
                    <h3>${org.name} - ${org.org_id}</h3>
                </div>
                
                <p>${org.post_code}</p>
            </div>
        `;
    }
}
