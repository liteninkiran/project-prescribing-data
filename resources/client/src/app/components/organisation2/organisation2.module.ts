import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/modules/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { Organisation2Component } from './organisation2.component';
import { OrganisationFiltersComponent } from './filters/filters.component';

@NgModule({
    declarations: [
        Organisation2Component,
        OrganisationFiltersComponent,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
    ],
    exports: [
        Organisation2Component,
        OrganisationFiltersComponent,
    ],
})
export class Organisation2Module { }
