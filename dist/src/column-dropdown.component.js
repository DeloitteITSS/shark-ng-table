import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
var SharkColumnDropdownComponent = (function () {
    function SharkColumnDropdownComponent(elementRef) {
        this.elementRef = elementRef;
        this.columnChange = new EventEmitter();
        this.showDropDown = false;
    }
    SharkColumnDropdownComponent.prototype.closeDropDownWithEscape = function () {
        if (this.showDropDown) {
            this.showDropDown = false;
            this.dropdownButton.nativeElement.focus();
        }
    };
    SharkColumnDropdownComponent.prototype.closeDropDown = function (event) {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.showDropDown = false;
        }
    };
    SharkColumnDropdownComponent.prototype.emitSelected = function () {
        this.columnChange.emit(this.columns);
    };
    SharkColumnDropdownComponent.decorators = [
        { type: Component, args: [{
                    selector: 'shark-column-dropdown',
                    template: "\n    <span class=\"column-picker\">\n        <button class=\"toggle-dropdown\" (click)=\"showDropDown = !showDropDown\" [attr.aria-expanded]=\"showDropDown\" aria-controls=\"column-picker-dropdown\" type=\"button\" #dropdownButton>\n          <span>Choose Columns<i class=\"fa fa-fw fa-angle-down\"></i></span>\n        </button>\n        <div id=\"column-picker-dropdown\" class=\"dropdown\" [attr.aria-hidden]=\"!showDropDown\" aria-label=\"submenu\" [ngStyle]=\"{'display': showDropDown ? 'block': 'none'}\">\n          <fieldset>\n            <legend class=\"screen-reader\">Columns to display</legend>\n            <label *ngFor=\"let column of columns\">\n              <input type=\"checkbox\" [(ngModel)]=\"column.displayed\" (ngModelChange)=\"emitSelected(column)\" />\n              {{ column.header }}\n            </label>\n          </fieldset>\n        </div>\n    </span>\n  "
                },] },
    ];
    /** @nocollapse */
    SharkColumnDropdownComponent.ctorParameters = function () { return [
        { type: ElementRef, },
    ]; };
    SharkColumnDropdownComponent.propDecorators = {
        'dropdownButton': [{ type: ViewChild, args: ['dropdownButton',] },],
        'columns': [{ type: Input },],
        'notifierService': [{ type: Input },],
        'columnChange': [{ type: Output },],
        'closeDropDownWithEscape': [{ type: HostListener, args: ['document:keydown.escape', [],] },],
        'closeDropDown': [{ type: HostListener, args: ['document:click', ['$event'],] }, { type: HostListener, args: ['document:touchstart', ['$event'],] },],
    };
    return SharkColumnDropdownComponent;
}());
export { SharkColumnDropdownComponent };
//# sourceMappingURL=column-dropdown.component.js.map