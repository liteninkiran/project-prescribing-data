import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrganisationComponent } from './organisation.component';

describe('Organisation2Component', () => {
    let component: OrganisationComponent;
    let fixture: ComponentFixture<OrganisationComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [OrganisationComponent]
        });
        fixture = TestBed.createComponent(OrganisationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
