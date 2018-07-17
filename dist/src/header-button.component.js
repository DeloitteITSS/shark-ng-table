import { Component, EventEmitter, Input, Output } from '@angular/core';
var SharkTableHeaderButtonComponent = (function () {
    function SharkTableHeaderButtonComponent() {
        this.sortChange = new EventEmitter();
        this.ariaButtonLabel = 'Change Sorting';
    }
    SharkTableHeaderButtonComponent.prototype.changeSort = function () {
        this.sortChange.emit({
            property: this.column.property,
            sortType: this.column.sortType
        });
    };
    SharkTableHeaderButtonComponent.decorators = [
        { type: Component, args: [{
                    selector: 'shark-table-header-button',
                    template: "\n    <span class=\"header-text pointer\" (click)=\"changeSort()\" (keyup.enter)=\"changeSort()\">{{ column.header }}</span>\n    <button class=\"sort-button\" [name]=\"column.header\" (click)=\"changeSort()\" type=\"button\" aria-label=\"Change Sorting\">\n      <i class=\"sorting fas fa-fw\" [ngClass]=\"{\n        'unsorted': !column.sortType || column.sortType === 0,\n        'fa-sort': !column.sortType || column.sortType === 0,\n        'asc': column.sortType === 1,\n        'fa-sort-up': column.sortType === 1,\n        'desc': column.sortType === 2,\n        'fa-sort-down': column.sortType === 2\n      }\"></i>\n    </button>\n  "
                },] },
    ];
    /** @nocollapse */
    SharkTableHeaderButtonComponent.ctorParameters = function () { return []; };
    SharkTableHeaderButtonComponent.propDecorators = {
        'column': [{ type: Input },],
        'sortChange': [{ type: Output },],
    };
    return SharkTableHeaderButtonComponent;
}());
export { SharkTableHeaderButtonComponent };
//# sourceMappingURL=header-button.component.js.map