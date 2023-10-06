import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'shared-async-button',
    templateUrl: './async-button.component.html',
    styleUrls: ['./async-button.component.scss'],
})
export class AsyncButtonComponent implements OnInit {
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
