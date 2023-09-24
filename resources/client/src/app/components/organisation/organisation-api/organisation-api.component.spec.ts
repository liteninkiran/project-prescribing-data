import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrganisationApiComponent } from './organisation-api.component';

describe('OrganisationComponent', () => {
    let component: OrganisationApiComponent;
    let fixture: ComponentFixture<OrganisationApiComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [OrganisationApiComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(OrganisationApiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
