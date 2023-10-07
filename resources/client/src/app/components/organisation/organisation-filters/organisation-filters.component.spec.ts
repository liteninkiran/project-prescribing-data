import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrganisationFiltersComponent } from './organisation-filters.component';

describe('FiltersComponent', () => {
    let component: OrganisationFiltersComponent;
    let fixture: ComponentFixture<OrganisationFiltersComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [OrganisationFiltersComponent]
        });
        fixture = TestBed.createComponent(OrganisationFiltersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
