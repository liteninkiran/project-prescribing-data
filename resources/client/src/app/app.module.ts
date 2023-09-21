// Angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

// Modules
import { MaterialModule } from './modules/material.module';
import { AppRoutingModule } from './app-routing.module';
import { SamplesModule } from './components/samples/samples.module';
import { RoleModule } from './components/role/role.module';
import { OrganisationModule } from './components/organisation/organisation.module';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
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

        // Feature Modules
        SamplesModule,
        RoleModule,
        OrganisationModule,
    ],
    providers: [],
    bootstrap: [
        AppComponent,
    ],
})
export class AppModule { }
