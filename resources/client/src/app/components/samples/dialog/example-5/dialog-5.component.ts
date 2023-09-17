import { Component } from '@angular/core';
import { openFormDialog } from './dialog-form/dialog-form.component';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs';

@Component({
    selector: 'app-dialog-5',
    template: `
        <h3>Dialog with reactive form</h3>
        <button mat-raised-button (click)="openForm()">Open Form</button>
`,
    styles: [],
})
export class Dialog5Component {

    constructor(private dialog: MatDialog) { }

    openForm() {
        openFormDialog(this.dialog)
            .pipe(filter(val => !!val))
            .subscribe(val => console.log('Form data:', val));
    }
}
