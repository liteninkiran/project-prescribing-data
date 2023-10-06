import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TableComponent } from './table/table.component';
import { MaterialModule } from 'src/app/modules/material.module';
import { PipeModule } from 'src/app/modules/pipe.module';
import { CheckboxMenuComponent } from './checkbox-menu/checkbox-menu.component';
import { MapComponent } from './map/map.component';
import { ButtonComponent } from './button/button.component';
import { SelectComponent } from './select/select.component';

@NgModule({
    declarations: [
        TableComponent,
        ButtonComponent,
        CheckboxMenuComponent,
        SelectComponent,
        MapComponent,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        PipeModule,
        ReactiveFormsModule,
    ],
    exports: [
        TableComponent,
        ButtonComponent,
        CheckboxMenuComponent,
        SelectComponent,
        MapComponent,
    ],
})
export class SharedModule { }
