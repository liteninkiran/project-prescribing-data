import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleFiltersComponent } from './role/filters/filters.component';
import { MaterialModule } from 'src/app/modules/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { RoleComponent } from './role/container/role.component';

@NgModule({
    declarations: [
        RoleComponent,
        RoleFiltersComponent,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
        SharedModule,
    ],
    exports: [
        RoleComponent,
        RoleFiltersComponent,
    ],
})
export class RoleModule { }
