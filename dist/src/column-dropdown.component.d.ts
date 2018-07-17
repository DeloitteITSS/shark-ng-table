import { ElementRef, EventEmitter } from '@angular/core';
import { SharkColumn } from './column';
import { NotifierService } from './notifier/notifier.service';
export declare class SharkColumnDropdownComponent {
    private elementRef;
    dropdownButton: ElementRef;
    columns: SharkColumn[];
    notifierService: NotifierService;
    columnChange: EventEmitter<SharkColumn[]>;
    showDropDown: boolean;
    constructor(elementRef: ElementRef);
    closeDropDownWithEscape(): void;
    closeDropDown(event: Event): void;
    emitSelected(): void;
}
