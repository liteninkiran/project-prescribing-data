import { Component } from '@angular/core';
import { ICheckboxMenuItem } from 'src/app/interfaces/shared.interface';

@Component({
    selector: 'sample-checkbox-menu',
    templateUrl: './checkbox-menu.component.html',
    styleUrls: ['./checkbox-menu.component.scss'],
})
export class CheckboxMenuComponent {
    public selections: any;
    public items: ICheckboxMenuItem[] = [
        { label: 'Item 1', value: 1, name: 'item_01', checked: false },
        { label: 'Item 2', value: 2, name: 'item_02', checked: true },
        { label: 'Item 3 has a slightly longer description for testing purposes', value: 3, name: 'item_03', checked: true },
        { label: 'Item 4', value: 4, name: 'item_04', checked: true },
        { label: 'Item 5', value: 5, name: 'item_05', checked: false },
    ];

    public formValue(value: any): void {
        this.selections = value;
    }
}
