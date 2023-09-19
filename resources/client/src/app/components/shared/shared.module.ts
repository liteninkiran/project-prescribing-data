import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table/table.component';
import { MaterialModule } from 'src/app/modules/material.module';
import { PipeModule } from 'src/app/modules/pipe.module';
import { ButtonComponent } from './button/button.component';

@NgModule({
    declarations: [
        TableComponent,
        ButtonComponent,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        PipeModule,
    ],
    exports: [
        TableComponent,
        ButtonComponent,
    ],
})
export class SharedModule { }
