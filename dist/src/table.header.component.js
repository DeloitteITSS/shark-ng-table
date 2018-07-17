import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { DOCUMENT } from '@angular/common';
var SharkTableHeaderComponent = (function () {
    function SharkTableHeaderComponent(document) {
        this.document = document;
        this.sortChange = new EventEmitter();
        this.filterChange = new EventEmitter();
        this.columnChange = new EventEmitter();
    }
    SharkTableHeaderComponent.prototype.dispatchSortChangeEvent = function (event) {
        this.sortChange.emit(event);
    };
    SharkTableHeaderComponent.prototype.fireFilterChange = function () {
        this.filterChange.emit({
            columns: this.columns,
            filter: this.filter,
            localPagingSize: this.localPagingSize
        });
    };
    SharkTableHeaderComponent.prototype.moveColumnForward = function (index, column) {
        var _this = this;
        this.move(index, 1);
        this.notifierService.postMessage('column moved right');
        var newIndex = this.columns.indexOf(column);
        setTimeout(function () {
            if (newIndex === _this.columns.length - 1) {
                _this.focusButton(column, 'left');
            }
            else {
                _this.focusButton(column, 'right');
            }
        }, 100);
    };
    SharkTableHeaderComponent.prototype.moveColumnBackward = function (index, column) {
        var _this = this;
        this.move(index, -1);
        this.notifierService.postMessage('column moved left');
        var newIndex = this.columns.indexOf(column);
        setTimeout(function () {
            if (newIndex === 0) {
                _this.focusButton(column, 'right');
            }
            else {
                _this.focusButton(column, 'left');
            }
        }, 100);
    };
    SharkTableHeaderComponent.prototype.focusButton = function (column, dir) {
        var button = document.getElementById(column.property + '-' + dir);
        if (button) {
            button.focus();
        }
    };
    SharkTableHeaderComponent.prototype.move = function (index, offset) {
        var newIndex = index + offset;
        if (newIndex > -1 && newIndex < this.columns.length) {
            var removedElement = this.columns.splice(index, 1)[0];
            this.columns.splice(newIndex, 0, removedElement);
        }
    };
    SharkTableHeaderComponent.decorators = [
        { type: Component, args: [{
                    selector: '[shark-table-header]',
                    template: "\n        <tr class=\"header-row header-border\" *ngIf=\"columns.length > 0\">\n            <th id=\"childHeader\" *ngIf=\"childRows\" class=\"child-spacer\">\n              <span class=\"screen-reader\">Details</span>\n            </th>\n            <th class=\"header-buttons\" [ngClass]=\"{'right': column.alignRight }\" scope=\"col\"\n                *ngFor=\"let column of columns; let i = index; let f = first; let l = last;\"\n                [attr.id]=\"column.property\"\n                [attr.aria-sort]=\"(!sortable || column.unsortable) ? null : (!column.sortType || column.sortType === 0) ? 'none' : column.sortType === 1 ? 'ascending' : 'descending'\">\n                <button *ngIf=\"columnOrdering && !f\" (click)=\"moveColumnBackward(i, column)\" type=\"button\" class=\"ordering-button fa fa-angle-left\" [id]=\"column.property + '-left'\">\n                  <span class=\"screen-reader-button-label\">{{ 'Move the ' + column.header + ' column left' }}</span>\n                </button>\n                <shark-table-header-button *ngIf=\"sortable && !column.unsortable\" [column]=\"column\" (sortChange)=\"dispatchSortChangeEvent($event)\"></shark-table-header-button>\n                <ng-container *ngIf=\"!sortable || column.unsortable\">\n                  {{ column.header }}\n                </ng-container>\n                <button *ngIf=\"columnOrdering && !l\" (click)=\"moveColumnForward(i, column)\" type=\"button\" class=\"ordering-button fa fa-angle-right\" [id]=\"column.property + '-right'\">\n                  <span class=\"screen-reader-button-label\">{{ 'Move the ' + column.header + ' column right' }}</span>\n                </button>\n                <div *ngIf=\"columnFiltering && filterable\">\n                  <label [for]=\"'column-' + i\" class=\"screen-reader\">{{ column.header }} filter</label>\n                  <input type=\"text\" name=\"column{{i}}\" [id]=\"'column-' + i\" [(ngModel)]=\"column.filter\" (ngModelChange)=\"fireFilterChange()\" [attr.placeholder]=\"showFilterPlaceholders ? (column.header + ' filter') : null\" />\n                </div>\n            </th>\n        </tr>\n    "
                },] },
    ];
    /** @nocollapse */
    SharkTableHeaderComponent.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] },] },
    ]; };
    SharkTableHeaderComponent.propDecorators = {
        'sortable': [{ type: Input },],
        'columns': [{ type: Input },],
        'columnOrdering': [{ type: Input },],
        'childRows': [{ type: Input },],
        'page': [{ type: Input },],
        'filterable': [{ type: Input },],
        'columnFiltering': [{ type: Input },],
        'filter': [{ type: Input },],
        'showFilterPlaceholders': [{ type: Input },],
        'notifierService': [{ type: Input },],
        'localPagingSize': [{ type: Input },],
        'sortChange': [{ type: Output },],
        'filterChange': [{ type: Output },],
        'columnChange': [{ type: Output },],
    };
    return SharkTableHeaderComponent;
}());
export { SharkTableHeaderComponent };
//# sourceMappingURL=table.header.component.js.map