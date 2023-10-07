import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrganisationViewComponent } from './organisation-view.component';

describe('OrgViewComponent', () => {
    let component: OrganisationViewComponent;
    let fixture: ComponentFixture<OrganisationViewComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [OrganisationViewComponent]
        });
        fixture = TestBed.createComponent(OrganisationViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
