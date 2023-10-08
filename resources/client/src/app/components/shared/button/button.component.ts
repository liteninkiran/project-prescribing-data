import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'shared-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
    @Input() public buttonText = '';
    @Input() public colour = 'Primary';
    @Input() public icon = '';
    @Input() public loaded = false;

    @Output() public clickEvent = new EventEmitter<void>();

    public loading = false;

    constructor() {

    }

    public ngOnInit(): void {

    }

    public onClick() {
        this.loading = true;
        this.clickEvent.emit();
    }
}
