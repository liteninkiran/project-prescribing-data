import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarLinksComponent } from './navbar-links.component';

describe('NavbarComponent', () => {
    let component: NavbarLinksComponent;
    let fixture: ComponentFixture<NavbarLinksComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [NavbarLinksComponent]
        });
        fixture = TestBed.createComponent(NavbarLinksComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
