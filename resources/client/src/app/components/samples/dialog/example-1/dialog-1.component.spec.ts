import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Dialog1Component } from './dialog-1.component';

describe('Dialog1Component', () => {
    let component: Dialog1Component;
    let fixture: ComponentFixture<Dialog1Component>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [Dialog1Component]
        });
        fixture = TestBed.createComponent(Dialog1Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
