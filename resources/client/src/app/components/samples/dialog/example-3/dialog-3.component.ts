import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogDataComponent } from './dialog-data/dialog-data.component';

export interface DialogData {
    animal: 'panda' | 'unicorn' | 'lion';
}

@Component({
    selector: 'app-dialog-3',
    templateUrl: './dialog-3.component.html',
    styleUrls: ['./dialog-3.component.scss'],
})
export class Dialog3Component {
    constructor(public dialog: MatDialog) { }

    openDialog() {
        this.dialog.open(DialogDataComponent, {
            data: {
                animal: 'panda',
            },
        });
    }
}
