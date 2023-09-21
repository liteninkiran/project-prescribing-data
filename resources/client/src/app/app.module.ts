// Angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

// Modules
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MaterialModule } from './modules/material.module';
import { PipeModule } from './modules/pipe.module';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './components/shared/shared.module';
import { SamplesModule } from './components/samples/samples.module';
import { RoleModule } from './components/role/role.module';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { OrganisationComponent } from './components/organisation/organisation.component';
import { OrganisationViewComponent } from './components/organisation-view/organisation-view.component';
import { Organisation2Module } from './components/organisation2/organisation2.module';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        OrganisationComponent,
        OrganisationViewComponent,
    ],
    imports: [
        // Built-in Modules
        BrowserAnimationsModule,
        BrowserModule,
        HttpClientModule,
        ReactiveFormsModule,

        // Routing Modules
        AppRoutingModule,

        // Shared Modules
        MaterialModule,
        PipeModule,
        NgxJsonViewerModule,
        LeafletModule,
        SharedModule,

        // Feature Modules
        SamplesModule,
        RoleModule,
        Organisation2Module,
    ],
    providers: [],
    bootstrap: [
        AppComponent,
    ],
})
export class AppModule { }
