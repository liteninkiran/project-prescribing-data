import { Component, Input } from '@angular/core';
import { IMatSelectOptions } from 'src/app/interfaces/shared.interface';

@Component({
    selector: 'app-async-select',
    templateUrl: './async-select.component.html',
    styleUrls: ['./async-select.component.scss'],
})
export class AsyncSelectComponent {

    @Input() public label: string = 'Label';
    @Input() public fControl: any;
    @Input() public data: IMatSelectOptions[] = [];
}
