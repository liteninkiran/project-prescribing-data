import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TableComponent } from './table/table.component';
import { MaterialModule } from 'src/app/modules/material.module';
import { PipeModule } from 'src/app/modules/pipe.module';
import { AsyncButtonComponent } from './async-button/async-button.component';
import { CheckboxMenuComponent } from './checkbox-menu/checkbox-menu.component';
import { AsyncSelectComponent } from './async-select/async-select.component';

@NgModule({
    declarations: [
        TableComponent,
        AsyncButtonComponent,
        CheckboxMenuComponent,
        AsyncSelectComponent,
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
        AsyncSelectComponent,
    ],
})
export class SharedModule { }
