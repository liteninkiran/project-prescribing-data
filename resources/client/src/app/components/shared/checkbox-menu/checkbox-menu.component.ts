import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ICheckboxMenuItem } from 'src/app/interfaces/shared.interface';

@Component({
    selector: 'shared-checkbox-menu',
    templateUrl: './checkbox-menu.component.html',
    styleUrls: ['./checkbox-menu.component.scss'],
})
export class CheckboxMenuComponent implements OnInit {
    @Input() public items: ICheckboxMenuItem[] = [];
    @Input() public colour: '' | 'primary' | 'accent' | 'warn' = '';
    @Input() public icon = '';
    @Input() public title = '';
    @Input() public xPosition: 'after' | 'before' = 'after';
    @Input() public yPosition: 'above' | 'below' = 'above';

    @Output() public selectionChanged = new EventEmitter<any>();

    public form = this.fb.group({});

    private mappedItems: any;
    private entries: any;

    constructor(
        private fb: FormBuilder
    ) {

    }

    public ngOnInit(): void {
        this.mappedItems = this.items.map(item => [item.formControlName, item.checked]);
        this.entries = Object.fromEntries(this.mappedItems);
        this.form = this.fb.group(this.entries);
        //this.form.valueChanges.subscribe(value => this.selectionChanged.emit(value));
    }

    public onClose() {
        this.selectionChanged.emit(this.form.value)
    }
}
