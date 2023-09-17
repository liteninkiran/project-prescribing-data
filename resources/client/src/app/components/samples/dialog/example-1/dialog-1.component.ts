import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogOverviewComponent } from './dialog-overview/dialog-overview.component';

export interface DialogData {
    animal: string;
}

@Component({
    selector: 'app-dialog-1',
    template: `
        <h3>Dialog Overview</h3>
        <button mat-raised-button (click)="openDialog()">Open Dialog</button>
        <p>{{ animal }}</p>`,
    styles: [],
})
export class Dialog1Component {
    public animal!: string;

    constructor(public dialog: MatDialog) { }

    openDialog(): void {
        const dialogRef = this.dialog.open(DialogOverviewComponent, {
            data: { animal: this.animal },
        });

        dialogRef.afterClosed().subscribe(result => {
            this.animal = result;
        });
    }
}
