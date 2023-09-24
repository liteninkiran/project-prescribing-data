import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleFiltersComponent } from './filters.component';

describe('FiltersComponent', () => {
    let component: RoleFiltersComponent;
    let fixture: ComponentFixture<RoleFiltersComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [RoleFiltersComponent]
        });
        fixture = TestBed.createComponent(RoleFiltersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
