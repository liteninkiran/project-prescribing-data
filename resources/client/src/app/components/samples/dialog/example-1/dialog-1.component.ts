import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogOverviewComponent } from './dialog-overview/dialog-overview.component';

export interface DialogData {
    animal: string;
    name: string;
}

@Component({
    selector: 'app-dialog-1',
    templateUrl: './dialog-1.component.html',
    styleUrls: ['./dialog-1.component.scss'],
})
export class Dialog1Component {
    public animal!: string;
    public name!: string;

    constructor(public dialog: MatDialog) { }

    openDialog(): void {
        const dialogRef = this.dialog.open(DialogOverviewComponent, {
            data: { name: this.name, animal: this.animal },
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            this.animal = result;
        });
    }
}
