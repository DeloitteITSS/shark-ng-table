import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SharkTableUtils } from './table.utils';
/**
 * This component controls each row in the table.
 */
var SharkTableBodyComponent = (function () {
    function SharkTableBodyComponent(router, tableUtils) {
        this.router = router;
        this.tableUtils = tableUtils;
        this.openChildren = [];
    }
    SharkTableBodyComponent.prototype.ngOnChanges = function (changes) {
        if (changes.hasOwnProperty('page') && !changes['page'].isFirstChange()) {
            this.openChildren = [];
        }
    };
    SharkTableBodyComponent.prototype.addStyleToCell = function (row, column) {
        if (this.cellStylingFunction) {
            var cellData = this.tableUtils.retrieveCell(row, column);
            return this.cellStylingFunction(row, column, cellData);
        }
        return null;
    };
    SharkTableBodyComponent.prototype.childOpen = function (index) {
        return this.openChildren.indexOf(index) > -1;
    };
    /**
     * Toggle the show/hide status of the child row
     */
    SharkTableBodyComponent.prototype.toggleChild = function (index) {
        if (this.openChildren.indexOf(index) > -1) {
            this.openChildren.splice(this.openChildren.indexOf(index), 1);
        }
        else {
            this.openChildren.push(index);
        }
        this.openChildren = this.openChildren.slice(0);
    };
    /**
     * If provided, navigate to link for this row using the router.
     *
     * @param {Object} row
     */
    SharkTableBodyComponent.prototype.rowClick = function (row) {
        if (this.linkTarget && this.linkKey) {
            this.router.navigate([this.linkTarget, this.tableUtils.findValue(row, this.linkKey)]);
        }
    };
    SharkTableBodyComponent.decorators = [
        { type: Component, args: [{
                    selector: '[shark-table-body]',
                    template: "\n        <ng-container *ngIf=\"page.content && currentColumns.length > 0\">\n          <ng-container *ngFor=\"let row of (page.content | localfilter:currentColumns:localFilter:localPaging:columnFiltering:filter); let e = even; let o = odd; let i = index;\">\n            <tr class=\"data-row\"\n                [ngClass]=\"{ odd: o, even: e, rowLink: linkTarget, rowOpen: childOpen(i) }\"\n                [ngStyle]=\"rowStylingFunction(row)\"\n                (click)=\"rowClick(row)\" (keyup.enter)=\"rowClick(row)\"\n                [attr.tabindex]=\"linkTarget ? 0 : null\"\n            >\n                <td class=\"header-buttons\" *ngIf=\"childRows\">\n                  <button class=\"black-arrow fa fa-fw\"\n                          [attr.aria-expanded]=\"childOpen(i)\"\n                          [ngClass]=\"{ 'open': childOpen(i), 'closed': !childOpen(i), 'fa-caret-down': childOpen(i), 'fa-caret-right': !childOpen(i) }\"\n                          (click)=\"toggleChild(i)\" type=\"button\" aria-label=\"Details Row\"\n                  >\n                  </button>\n                </td>\n                <ng-container *ngFor=\"let column of currentColumns\">\n                    <td [ngClass]=\"{'right': column.alignRight }\" [ngStyle]=\"addStyleToCell(row, column)\">\n                        <shark-table-cell [column]=\"column\" [row]=\"row\"></shark-table-cell>\n                    </td>\n                </ng-container>\n            </tr>\n            <tr *ngIf=\"childRows\" class=\"data-row child-row\" [ngClass]=\"{ odd: o, even: e, rowOpen: childOpen(i) }\" [hidden]=\"!childOpen(i)\">\n                <td></td>\n                <td [attr.colspan]=\"currentColumns.length\">\n                    <shark-child [component]=\"childComponent\" [row]=\"row\" [rowIndex]=\"i\" [openChildren]=\"openChildren\"></shark-child>\n                </td>\n            </tr>\n          </ng-container>\n        </ng-container>\n        <ng-container *ngIf=\"currentColumns.length === 0\">\n          <tr><td [attr.colspan]=\"childRows ? columns.length + 1 : columns.length\">There are no columns selected</td></tr>\n        </ng-container>\n        <ng-container *ngIf=\"(!page.content || page.content.length == 0) && currentColumns.length > 0\">\n          <tr><td [attr.colspan]=\"childRows ? currentColumns.length + 1 : currentColumns.length\">{{ tableEmptyMessage }}</td></tr>\n        </ng-container>\n    "
                },] },
    ];
    /** @nocollapse */
    SharkTableBodyComponent.ctorParameters = function () { return [
        { type: Router, },
        { type: SharkTableUtils, },
    ]; };
    SharkTableBodyComponent.propDecorators = {
        'currentColumns': [{ type: Input },],
        'columns': [{ type: Input },],
        'localFilter': [{ type: Input },],
        'localPaging': [{ type: Input },],
        'columnFiltering': [{ type: Input },],
        'filter': [{ type: Input },],
        'rowStylingFunction': [{ type: Input },],
        'cellStylingFunction': [{ type: Input },],
        'childRows': [{ type: Input },],
        'childComponent': [{ type: Input },],
        'linkTarget': [{ type: Input },],
        'linkKey': [{ type: Input },],
        'tableEmptyMessage': [{ type: Input },],
        'page': [{ type: Input },],
    };
    return SharkTableBodyComponent;
}());
export { SharkTableBodyComponent };
//# sourceMappingURL=table.body.component.js.map