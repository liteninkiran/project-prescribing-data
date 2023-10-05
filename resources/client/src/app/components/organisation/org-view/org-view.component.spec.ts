import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrgViewComponent } from './org-view.component';

describe('OrgViewComponent', () => {
    let component: OrgViewComponent;
    let fixture: ComponentFixture<OrgViewComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [OrgViewComponent]
        });
        fixture = TestBed.createComponent(OrgViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
