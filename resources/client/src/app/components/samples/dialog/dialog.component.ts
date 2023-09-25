import { Component } from '@angular/core';

@Component({
    selector: 'app-dialog',
    template: `
        <app-dialog-1></app-dialog-1><hr>
        <app-dialog-2></app-dialog-2><hr>
        <app-dialog-3></app-dialog-3><hr>
        <app-dialog-4></app-dialog-4><hr>
        <app-dialog-5></app-dialog-5><hr>
        <app-mat-menu-chk></app-mat-menu-chk><hr>
        <sample-checkbox-menu></sample-checkbox-menu><hr>`,
    styles: [],
})
export class DialogComponent {

    constructor() { }

}
