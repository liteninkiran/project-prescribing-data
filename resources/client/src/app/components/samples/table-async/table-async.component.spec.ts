import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableAsyncComponent } from './table-async.component';

describe('TableAsyncComponent', () => {
    let component: TableAsyncComponent;
    let fixture: ComponentFixture<TableAsyncComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TableAsyncComponent]
        });
        fixture = TestBed.createComponent(TableAsyncComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
