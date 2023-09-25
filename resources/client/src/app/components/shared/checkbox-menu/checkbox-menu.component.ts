import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ICheckboxMenuItem } from 'src/app/interfaces/shared.interface';

@Component({
    selector: 'app-checkbox-menu',
    templateUrl: './checkbox-menu.component.html',
    styleUrls: ['./checkbox-menu.component.scss'],
})
export class CheckboxMenuComponent implements OnInit {
    @Input() public items: ICheckboxMenuItem[] = [];

    @Output() public selectionChanged = new EventEmitter<any>();

    public form = this.fb.group({});

    private mappedItems: any;
    private entries: any;

    constructor(
        private fb: FormBuilder
    ) {

    }

    public ngOnInit(): void {
        this.mappedItems = this.items.map(item => [item.name, item.checked]);
        this.entries = Object.fromEntries(this.mappedItems);
        this.form = this.fb.group(this.entries);
        this.form.valueChanges.subscribe(value => this.selectionChanged.emit(value));
    }
}
