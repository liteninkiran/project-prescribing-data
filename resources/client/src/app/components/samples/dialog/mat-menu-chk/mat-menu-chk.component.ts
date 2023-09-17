import { Component, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
    selector: 'app-mat-menu-chk',
    templateUrl: './mat-menu-chk.component.html',
    styleUrls: ['./mat-menu-chk.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class MatMenuChkComponent {
    @ViewChild('matMenuTrigger', { read: MatMenuTrigger }) private matMenuTriggerRef!: MatMenuTrigger;
    @ViewChild('matMenuTrigger', { read: MatButton }) private matButtonRef!: MatButton;
    @ViewChildren('menuItems') private menuItemsRef!: QueryList<MatCheckbox>;

    public triggerButtonText = 'Select a vehicle';

    public premiumAutomobilesList = [
        { title: 'Audi', activated: false, value: 'audi' },
        { title: 'Infiniti', activated: false, value: 'infiniti' },
        { title: 'BMW', activated: false, value: 'bmw' },
        { title: 'Mercedes', activated: false, value: 'mercedes' },
        { title: 'Lexus', activated: false, value: 'lexus' },
        { title: 'Alfa Romeo', activated: false, value: 'alfa romeo' },
        { title: 'Porsche', activated: false, value: 'porsche' },
    ];
    private selectedVehicles: string[] = [];
    public formattedSelectedVehicles: string = '';

    public onMenuOpened() {
        this.setFocusOnFirstItem();
        this.triggerButtonText = 'Close menu';
        this.formattedSelectedVehicles = '';
    }

    public onMenuClosed() {
        this.matButtonRef.focus();
        this.triggerButtonText = 'Select a vehicle';

        this.formattedSelectedVehicles =
            (this.selectedVehicles.length === 0
                ? 'No vehicles selected'
                : 'You selected ' + this.selectedVehicles.join(', ')) + '.';
    }

    public onMenuKeyDown(event: KeyboardEvent, index: number) {
        switch (event.key) {
            case 'ArrowUp':
                if (index > 0) {
                    this.setCheckboxFocus(index - 1);
                } else {
                    this.menuItemsRef.last.focus();
                }
                break;
            case 'ArrowDown':
                if (index !== this.menuItemsRef.length - 1) {
                    this.setCheckboxFocus(index + 1);
                } else {
                    this.setFocusOnFirstItem();
                }
                break;
            case 'Enter':
                event.preventDefault();
                this.premiumAutomobilesList[index].activated
                    = !this.premiumAutomobilesList[index].activated;
                this.onVehicleSelect();
                setTimeout(() => this.matMenuTriggerRef.closeMenu(), 200);
                break;
        }
    }

    public onVehicleSelect() {
        this.selectedVehicles = this.premiumAutomobilesList
            .filter(menuitem => menuitem.activated)
            .map(menuitem => menuitem.title);
    }

    private setFocusOnFirstItem(): void {
        const firstCheckbox = this.menuItemsRef.first;
        firstCheckbox.focus();
        firstCheckbox._elementRef.nativeElement.classList.add('cdk-keyboard-focused');
    }

    private setCheckboxFocus(index: number) {
        const checkBox = this.menuItemsRef.get(index);
        if (checkBox) {
            checkBox.focus();
        }
    }
}
