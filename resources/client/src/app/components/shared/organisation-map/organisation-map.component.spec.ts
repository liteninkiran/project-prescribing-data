import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrganisationMapComponent } from './organisation-map.component';

describe('OrganisationMapComponent', () => {
    let component: OrganisationMapComponent;
    let fixture: ComponentFixture<OrganisationMapComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [OrganisationMapComponent]
        });
        fixture = TestBed.createComponent(OrganisationMapComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
