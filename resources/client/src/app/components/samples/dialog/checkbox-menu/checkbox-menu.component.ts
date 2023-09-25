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
        { label: 'Item 1', value: 1, formControlName: 'item_01', checked: false },
        { label: 'Item 2', value: 2, formControlName: 'item_02', checked: true },
        { label: 'Item 3 has a slightly longer description for testing purposes', value: 3, formControlName: 'item_03', checked: true },
        { label: 'Item 4', value: 4, formControlName: 'item_04', checked: true },
        { label: 'Item 5', value: 5, formControlName: 'item_05', checked: false },
    ];

    public formValue(value: any): void {
        this.selections = value;
    }
}
