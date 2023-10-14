import { Component, OnInit, Input } from '@angular/core';
import { IMapData } from 'src/app/interfaces/shared.interface';

@Component({
    selector: 'shared-map-new',
    templateUrl: './map2.component.html',
    styleUrls: ['./map2.component.scss'],
})
export class Map2Component implements OnInit {
    @Input() public data: IMapData[] | null = null;

    public ngOnInit(): void {

    }

}
