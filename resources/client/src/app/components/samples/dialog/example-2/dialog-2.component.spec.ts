import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Dialog2Component } from './dialog-2.component';

describe('Dialog2Component', () => {
    let component: Dialog2Component;
    let fixture: ComponentFixture<Dialog2Component>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [Dialog2Component]
        });
        fixture = TestBed.createComponent(Dialog2Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
