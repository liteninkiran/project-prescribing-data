// Angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Modules
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MaterialModule } from './modules/material.module';
import { PipeModule } from './modules/pipe.module';
import { AppRoutingModule } from './app-routing.module';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { OrganisationComponent } from './components/organisation/organisation.component';
import { OrganisationViewComponent } from './components/organisation-view/organisation-view.component';
import { RoleComponent } from './components/role/role.component';
import { RoleFiltersComponent } from './components/role/filters/filters.component';
import { SharedModule } from './components/shared/shared.module';
import { SamplesModule } from './components/samples/samples.module';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        OrganisationComponent,
        OrganisationViewComponent,
        RoleComponent,
        RoleFiltersComponent,
    ],
    imports: [
        // Built-in Modules
        BrowserAnimationsModule,
        BrowserModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,

        // Custom Modules
        AppRoutingModule,
        MaterialModule,
        PipeModule,
        NgxJsonViewerModule,
        LeafletModule,

        // Feature Modules
        SharedModule,
        SamplesModule,
    ],
    providers: [],
    bootstrap: [
        AppComponent,
    ],
})
export class AppModule { }
