import { IOrganisation } from "src/app/interfaces/organisation.interface";
import { defaultIcon } from "../shared/map/map.component";
import { IMapData } from "src/app/interfaces/shared.interface";

export class OrganisationHelperService {

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

    private getTooltipText = (org: IOrganisation): string => {
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
