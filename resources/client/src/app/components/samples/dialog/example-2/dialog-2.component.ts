import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogContentComponent } from './dialog-content/dialog-content.component';

@Component({
    selector: 'app-dialog-2',
    template: `
        <h3>Dialog with header, scrollable content and actions</h3>

        <button mat-raised-button (click)="openDialog()">
            Open Dialog
        </button>`,
    styles: [],
})
export class Dialog2Component {
    constructor(public dialog: MatDialog) { }

    openDialog() {
        const dialogRef = this.dialog.open(DialogContentComponent);

        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
        });
    }
}
