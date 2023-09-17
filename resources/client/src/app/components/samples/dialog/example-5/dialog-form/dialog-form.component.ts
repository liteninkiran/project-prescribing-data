import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-dialog-form',
    templateUrl: './dialog-form.component.html',
    styles: [`
        .edit-course-form {
            min-width: 300px;
        }

        mat-dialog-content {
            display: flex;
            flex-direction: column;
        }

        textarea {
            height: 100px;
            resize: vertical;
        }`,
    ],
})
export class DialogFormComponent implements OnInit {
    public description: string = '';

    public form: FormGroup = this.fb.group({
        description: [''],
        category: [''],
        releasedAt: [''],
        longDescription: [''],
    });

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<DialogFormComponent>,
    ) {
        
    }

    public ngOnInit(): void {

    }

    public close(): void {
        this.dialogRef.close();
    }

    public save(): void {
        this.dialogRef.close(this.form.value);
    }

}

export function openFormDialog(dialog: MatDialog) {
    const config = new MatDialogConfig();
    config.disableClose = true;
    config.autoFocus = true;
    config.panelClass = 'modal-panel';
    config.backdropClass = 'backdrop-modal-panel';
    config.data = { data: 'data' }
    const dialogRef = dialog.open(DialogFormComponent, config);
    return dialogRef.afterClosed();
}
