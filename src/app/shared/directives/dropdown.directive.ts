import { Directive, HostListener, HostBinding } from '@angular/core';
@Directive({
    selector: '[appDropdown]'
})
export class DropdrownDirective {
    @HostBinding('class.show') isOpen = false;

    @HostListener('click') toggleOpen() {
        this.isOpen = !this.isOpen;
    }

    @HostListener('showDropdown') toggleOpen2() {
        this.isOpen = !this.isOpen;
    }
}