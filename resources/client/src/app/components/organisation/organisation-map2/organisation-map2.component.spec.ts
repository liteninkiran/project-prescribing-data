import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrganisationMap2Component } from './organisation-map2.component';

describe('OrganisationMap2Component', () => {
    let component: OrganisationMap2Component;
    let fixture: ComponentFixture<OrganisationMap2Component>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [OrganisationMap2Component]
        });
        fixture = TestBed.createComponent(OrganisationMap2Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
