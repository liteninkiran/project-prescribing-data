import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { DialogMenuComponent } from './dialog-menu/dialog-menu.component';
import { DialogMenu2Component } from './dialog-menu-2/dialog-menu-2.component';

export interface DialogData {
    animal: 'panda' | 'unicorn' | 'lion';
}

@Component({
    selector: 'app-dialog-4',
    template: `
        <h3>Dialog launched from a menu</h3>
        <button mat-raised-button [matMenuTriggerFor]="menu" #menuTrigger>Menu</button>
        <mat-menu #menu="matMenu">
            <button mat-menu-item (click)="openDialog(0)">Open dialog #1</button>
            <button mat-menu-item (click)="openDialog(1)">Open dialog #2</button>
        </mat-menu>`,
    styles: [],
})
export class Dialog4Component {
    @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;

    constructor(public dialog: MatDialog) { }

    public openDialog(index: number): void {
        const component = (() => {
            switch(index) {
                case 0: return DialogMenuComponent;
                case 1: return DialogMenu2Component;
            }
            return DialogMenuComponent;
        });

        const dialogRef = this.dialog.open(component(), { restoreFocus: false });

        // Manually restore focus to the menu trigger since the element that
        // opens the dialog won't be in the DOM any more when the dialog closes.
        dialogRef.afterClosed().subscribe(() => this.menuTrigger.focus());
    }
}
