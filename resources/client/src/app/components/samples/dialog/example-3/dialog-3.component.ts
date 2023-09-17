import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogDataComponent } from './dialog-data/dialog-data.component';

export interface DialogData {
    animal: 'panda' | 'unicorn' | 'lion';
}

@Component({
    selector: 'app-dialog-3',
    template: `
        <h3>Injecting data when opening a dialog</h3>

        <button mat-raised-button (click)="openDialog()">
            Open dialog
        </button>`,
    styles: [],
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
