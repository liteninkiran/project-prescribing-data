import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../dialog-3.component';

@Component({
    selector: 'app-dialog-data',
    templateUrl: './dialog-data.component.html',
    styles: [],
})
export class DialogDataComponent {

    constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

}
