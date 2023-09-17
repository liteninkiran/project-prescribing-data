import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogContentComponent } from './dialog-content/dialog-content.component';

@Component({
    selector: 'app-dialog-2',
    templateUrl: './dialog-2.component.html',
    styleUrls: ['./dialog-2.component.scss'],
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
