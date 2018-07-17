import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { SharkColumnDropdownComponent } from './column-dropdown.component';
var SharkTableInfoHeaderComponent = (function () {
    function SharkTableInfoHeaderComponent() {
        this.filterChange = new EventEmitter();
        this.columnChange = new EventEmitter();
    }
    SharkTableInfoHeaderComponent.prototype.fireFilterChange = function () {
        this.filterChange.emit({
            columns: this.columns,
            filter: this.filter,
            localPagingSize: this.localPagingSize
        });
    };
    SharkTableInfoHeaderComponent.prototype.fireColumnChange = function (event) {
        this.columnChange.emit(event);
    };
    SharkTableInfoHeaderComponent.decorators = [
        { type: Component, args: [{
                    selector: 'shark-table-info-header',
                    template: "\n    <div class=\"info-header\">\n      <div class=\"controls header-buttons\">\n        <button class=\"server-refresh fa fa-sync\" *ngIf=\"serverSideData\" (click)=\"fireFilterChange()\" type=\"button\">\n          <span class=\"screen-reader-button-label\">Refresh Server Data</span>\n        </button>\n        <shark-column-dropdown *ngIf=\"columnPicker\" [columns]=\"allColumns\" [notifierService]=\"notifierService\" (columnChange)=\"fireColumnChange($event)\"></shark-column-dropdown>\n        <span class=\"filter-box\" *ngIf=\"filterable && !columnFiltering && columns.length > 0\">\n          <label for=\"filter\" class=\"screen-reader\">Filter Results (all column search)</label>\n          <input #filterInput type=\"text\" name=\"filter\" id=\"filter\" [(ngModel)]=\"filter\" (ngModelChange)=\"fireFilterChange()\" [attr.placeholder]=\"showFilterPlaceholders ? 'Filter Results' : null\" />\n        </span>\n      </div>\n    </div>\n  "
                },] },
    ];
    /** @nocollapse */
    SharkTableInfoHeaderComponent.ctorParameters = function () { return []; };
    SharkTableInfoHeaderComponent.propDecorators = {
        'columnPickerComponent': [{ type: ViewChild, args: [SharkColumnDropdownComponent,] },],
        'filterInput': [{ type: ViewChild, args: ['filterInput',] },],
        'columns': [{ type: Input },],
        'allColumns': [{ type: Input },],
        'columnPicker': [{ type: Input },],
        'serverSideData': [{ type: Input },],
        'filterable': [{ type: Input },],
        'columnFiltering': [{ type: Input },],
        'filter': [{ type: Input },],
        'showFilterPlaceholders': [{ type: Input },],
        'localPagingSize': [{ type: Input },],
        'notifierService': [{ type: Input },],
        'filterChange': [{ type: Output },],
        'columnChange': [{ type: Output },],
    };
    return SharkTableInfoHeaderComponent;
}());
export { SharkTableInfoHeaderComponent };
//# sourceMappingURL=table.info.header.component.js.map