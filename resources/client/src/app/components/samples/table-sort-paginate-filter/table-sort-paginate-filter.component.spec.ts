import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableSortPaginateFilterComponent } from './table-sort-paginate-filter.component';

describe('TableSortPaginateFilterComponent', () => {
    let component: TableSortPaginateFilterComponent;
    let fixture: ComponentFixture<TableSortPaginateFilterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TableSortPaginateFilterComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TableSortPaginateFilterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
