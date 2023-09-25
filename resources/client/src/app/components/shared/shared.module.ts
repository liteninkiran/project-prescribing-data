import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table/table.component';
import { MaterialModule } from 'src/app/modules/material.module';
import { PipeModule } from 'src/app/modules/pipe.module';
import { AsyncButtonComponent } from './async-button/async-button.component';
import { CheckboxMenuComponent } from './checkbox-menu/checkbox-menu.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        TableComponent,
        AsyncButtonComponent,
        CheckboxMenuComponent,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        PipeModule,
        ReactiveFormsModule,
    ],
    exports: [
        TableComponent,
        AsyncButtonComponent,
        CheckboxMenuComponent,
    ],
})
export class SharedModule { }
