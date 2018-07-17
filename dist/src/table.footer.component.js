import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { SharkTableUtils } from './table.utils';
import { SharkTablePaginationComponent } from './table.pagination.component';
var SharkTableFooterComponent = (function () {
    function SharkTableFooterComponent(tableUtils) {
        this.tableUtils = tableUtils;
        this.start = 0;
        this.end = 0;
        this.total = 0;
        this.filtered = false;
        this.currentPageInfo = '';
        this.filterChange = new EventEmitter();
        this.paginationChange = new EventEmitter();
    }
    SharkTableFooterComponent.prototype.ngOnChanges = function (changes) {
        this.total = this.page.totalElements;
        var size = this.page.size ? this.page.size : this.page.numberOfElements;
        var newStart = this.page.number * size + 1;
        if (newStart > this.total) {
            this.start = 0;
        }
        else {
            this.start = newStart;
        }
        var newEnd = this.page.number * size + this.page.numberOfElements;
        if (newEnd > this.total) {
            this.end = this.total;
        }
        else {
            this.end = newEnd;
        }
        var wasFiltered = this.filtered;
        this.filtered = (this.filter && this.filter.length > 0) || this.tableUtils.hasFilter(this.columns);
        this.currentPageInfo = this.start + ' - ' + this.end + ' of ' + this.total + (this.filtered ? ' (filtered)' : '');
        var currentPageInfoAria = this.start + ' to ' + this.end + ' of ' + this.total + (this.filtered ? ' (filtered)' : '');
        if (changes.hasOwnProperty('page') && !changes['page'].isFirstChange()) {
            var pageChange = changes['page'];
            if (pageChange.previousValue.number !== pageChange.currentValue.number) {
                this.notifierService.postMessage('Page changed to ' + (pageChange.currentValue.number + 1) + ' showing ' + currentPageInfoAria);
            }
            else if (this.filtered || wasFiltered) {
                this.notifierService.postMessage('Filtering changed, showing ' + currentPageInfoAria);
            }
        }
        if (changes.hasOwnProperty('filter')) {
            var filterChange = changes['filter'];
            if (filterChange.previousValue !== filterChange.currentValue) {
                this.notifierService.postMessage('Filtering changed, showing ' + currentPageInfoAria);
            }
        }
    };
    SharkTableFooterComponent.prototype.firePageSizeChange = function () {
        this.filterChange.emit({
            columns: this.columns,
            filter: this.filter,
            localPagingSize: this.localPagingSize
        });
        this.notifierService.postMessage('Page size changed to ' + this.localPagingSize + ', page changed to ' + (this.page.number + 1));
    };
    SharkTableFooterComponent.prototype.changePage = function (pageNo) {
        this.paginationChange.emit(pageNo);
    };
    SharkTableFooterComponent.decorators = [
        { type: Component, args: [{
                    selector: 'shark-table-footer',
                    template: "\n  <div class=\"info-footer\">\n    <div class=\"page-size-controls\" *ngIf=\"localPaging && showLocalPagingOptions && columns.length > 0\">\n      <label for=\"local-paging-size\" class=\"local-paging-options\">\n        Rows per page:\n      </label>\n      <select [(ngModel)]=\"localPagingSize\" (change)=\"firePageSizeChange()\" name=\"localPagingSize\" id=\"local-paging-size\">\n        <option *ngFor=\"let option of localPagingOptions\" [value]=\"option\" [attr.selected]=\"option === localPagingSize ? 'selected' : null\">{{ option }}</option>\n      </select>\n      <span>{{ currentPageInfo }}</span>\n    </div>\n    <shark-table-pagination *ngIf=\"columns.length > 0\" [page]=\"page\" (paginationChange)=\"changePage($event)\"></shark-table-pagination>\n  </div>"
                },] },
    ];
    /** @nocollapse */
    SharkTableFooterComponent.ctorParameters = function () { return [
        { type: SharkTableUtils, },
    ]; };
    SharkTableFooterComponent.propDecorators = {
        'paginationComponent': [{ type: ViewChild, args: [SharkTablePaginationComponent,] },],
        'notifierService': [{ type: Input },],
        'localPaging': [{ type: Input },],
        'localPagingSize': [{ type: Input },],
        'localPagingOptions': [{ type: Input },],
        'showLocalPagingOptions': [{ type: Input },],
        'page': [{ type: Input },],
        'columns': [{ type: Input },],
        'filter': [{ type: Input },],
        'filterChange': [{ type: Output },],
        'paginationChange': [{ type: Output },],
    };
    return SharkTableFooterComponent;
}());
export { SharkTableFooterComponent };
//# sourceMappingURL=table.footer.component.js.map