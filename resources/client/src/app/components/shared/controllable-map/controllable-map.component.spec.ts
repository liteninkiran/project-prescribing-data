import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControllableMapComponent } from './controllable-map.component';

describe('ControllableMapComponent', () => {
    let component: ControllableMapComponent;
    let fixture: ComponentFixture<ControllableMapComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ControllableMapComponent]
        });
        fixture = TestBed.createComponent(ControllableMapComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
