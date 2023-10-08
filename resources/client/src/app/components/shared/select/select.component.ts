import { Component, Input } from '@angular/core';
import { IMatSelectOptions } from 'src/app/interfaces/shared.interface';

@Component({
    selector: 'shared-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.scss'],
})
export class SelectComponent {

    @Input() public label: string = 'Label';
    @Input() public fControl: any;
    @Input() public data: IMatSelectOptions[] = [];
    @Input() public panelClass: string[] = ['long-list'];
    @Input() public fontSize = '16px';
}
