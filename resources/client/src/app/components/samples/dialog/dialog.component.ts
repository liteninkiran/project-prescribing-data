import { Component } from '@angular/core';

@Component({
    selector: 'app-dialog',
    template: `
        <app-dialog-1></app-dialog-1><hr>
        <app-dialog-2></app-dialog-2><hr>
        <app-dialog-3></app-dialog-3>`,
    styles: [],
})
export class DialogComponent {

    constructor() { }

}
