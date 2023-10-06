import { Component } from '@angular/core';

@Component({
    selector: 'app-navbar-links',
    templateUrl: './navbar-links.component.html',
    styleUrls: ['./navbar-links.component.scss'],
})
export class NavbarLinksComponent {

    public config: IConfig[] = [
        {
            link: '/home',
            icon: 'home',
            text: 'Home',
        },
        {
            link: '/organisations-map',
            icon: 'push_pin',
            text: 'Organisations Map',
        },
        {
            link: '/organisations',
            icon: 'factory',
            text: 'Organisations',
        },
        {
            link: '/roles',
            icon: 'roller_skating',
            text: 'Roles',
        },
        {
            link: '/samples',
            icon: 'electrical_services',
            text: 'Sample Components',
        },
    ]
}

interface IConfig {
    link: string,
    icon: string,
    text: string,
}
