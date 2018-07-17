(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/router'), require('@angular/forms'), require('rxjs/Observable'), require('rxjs/Subject')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common', '@angular/router', '@angular/forms', 'rxjs/Observable', 'rxjs/Subject'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.sharktable = {}),global.ng.core,global.ng.common,global.ng.router,global.ng.forms,global.Rx,global.Rx));
}(this, (function (exports,core,common,router,forms,Observable,Subject) { 'use strict';

var SharkTableUtils = (function () {
    function SharkTableUtils() {
    }
    SharkTableUtils.prototype.exportRow = function (row, columns, rendered) {
        var _this = this;
        var newRow = {};
        Object.keys(row).forEach(function (key) {
            var col = columns.filter(function (col) { return col.displayed; }).find(function (col) { return col.property === key; });
            if (col) {
                newRow[key] = _this.retrieveCell(row, col, rendered);
            }
        });
        return newRow;
    };
    SharkTableUtils.prototype.retrieveCell = function (row, column, rendered) {
        if (rendered === void 0) { rendered = true; }
        var cell = this.findValue(row, column.property);
        if (column.pipe && rendered) {
            return this.applyPipe(column.pipe, cell, column.pipeArgs, column.pipeConstructorArgs);
        }
        return cell;
    };
    SharkTableUtils.prototype.applyPipe = function (pipe, cell, pipeArgs, pipeConstructorArgs) {
        var pipeInstance = new (pipe.bind.apply(pipe, [void 0].concat(pipeConstructorArgs)))();
        return pipeInstance.transform.apply(pipeInstance, [cell].concat(pipeArgs));
    };
    SharkTableUtils.prototype.filter = function (items, cols, columnFiltering, filterText) {
        var _this = this;
        return items.filter(function (row) {
            var found = false;
            if (columnFiltering && _this.hasFilter(cols)) {
                var rowFound = false;
                // Not using forEach here because we needed to break when a false match occurs during column filtering
                for (var _i = 0, cols_1 = cols; _i < cols_1.length; _i++) {
                    var col = cols_1[_i];
                    var value = _this.retrieveCell(row, col) + '';
                    var search = col.filter ? col.filter : '';
                    if (search.length > 0) {
                        if (value && (value.toLowerCase().indexOf(search.toLowerCase()) !== -1)) {
                            rowFound = true;
                        }
                        else {
                            rowFound = false;
                            break;
                        }
                    }
                }
                found = rowFound;
            }
            else if (columnFiltering && !_this.hasFilter(cols)) {
                return true;
            }
            else if (filterText) {
                cols.forEach(function (col) {
                    var value = _this.retrieveCell(row, col) + '';
                    if (filterText && value && (value.toLowerCase().indexOf(filterText.toLowerCase()) !== -1)) {
                        found = true;
                    }
                });
            }
            return found;
        });
    };
    SharkTableUtils.prototype.findValue = function (input, key) {
        var arr = key.split('.');
        while (arr.length && (input = input[arr.shift()])) { }
        
        return input;
    };
    SharkTableUtils.prototype.hasFilter = function (cols) {
        return cols.filter(function (col) { return col.filter && col.filter.length > 0; }).length > 0;
    };
    SharkTableUtils.decorators = [
        { type: core.Injectable },
    ];
    /** @nocollapse */
    SharkTableUtils.ctorParameters = function () { return []; };
    return SharkTableUtils;
}());

var SharkDynamicContentsDirective = (function () {
    function SharkDynamicContentsDirective(viewContainerRef) {
        this.viewContainerRef = viewContainerRef;
    }
    SharkDynamicContentsDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: '[sharkDynamicContents]'
                },] },
    ];
    /** @nocollapse */
    SharkDynamicContentsDirective.ctorParameters = function () { return [
        { type: core.ViewContainerRef, },
    ]; };
    return SharkDynamicContentsDirective;
}());

/**
 * This Component is used to render your custom child row component.
 */
var SharkChildComponent = (function () {
    function SharkChildComponent(tableUtils, componentFactoryResolver, changeDetectorRef) {
        this.tableUtils = tableUtils;
        this.componentFactoryResolver = componentFactoryResolver;
        this.changeDetectorRef = changeDetectorRef;
    }
    SharkChildComponent.prototype.ngAfterViewInit = function () {
        this.loadComponent();
    };
    SharkChildComponent.prototype.ngOnChanges = function (changes) {
        if (changes.hasOwnProperty('openChildren') && !changes['openChildren'].isFirstChange()) {
            this.childOpen = changes['openChildren'].currentValue.indexOf(this.rowIndex) > -1;
            this.componentRef.instance.childOpen(this.childOpen);
        }
    };
    SharkChildComponent.prototype.loadComponent = function () {
        var componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.component);
        var viewContainerRef = this.childContentsDirective.viewContainerRef;
        viewContainerRef.clear();
        this.componentRef = viewContainerRef.createComponent(componentFactory);
        this.componentRef.instance.data = this.row;
        // without this, everything went boom
        this.changeDetectorRef.detectChanges();
    };
    SharkChildComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'shark-child',
                    template: "\n      <ng-template sharkDynamicContents></ng-template>\n  "
                },] },
    ];
    /** @nocollapse */
    SharkChildComponent.ctorParameters = function () { return [
        { type: SharkTableUtils, },
        { type: core.ComponentFactoryResolver, },
        { type: core.ChangeDetectorRef, },
    ]; };
    SharkChildComponent.propDecorators = {
        'component': [{ type: core.Input },],
        'row': [{ type: core.Input },],
        'rowIndex': [{ type: core.Input },],
        'openChildren': [{ type: core.Input },],
        'childContentsDirective': [{ type: core.ViewChild, args: [SharkDynamicContentsDirective,] },],
    };
    return SharkChildComponent;
}());

/**
 * Enumeration of the 3 different Sort types
 */

(function (SharkSortType) {
    /**
     * No sorting applied, defaults to ASC.
     */
    SharkSortType[SharkSortType["NONE"] = 0] = "NONE";
    /**
     * Sort ascending (1, 2, 3)
     */
    SharkSortType[SharkSortType["ASC"] = 1] = "ASC";
    /**
     * Sort descending (3, 2, 1)
     */
    SharkSortType[SharkSortType["DESC"] = 2] = "DESC";
})(exports.SharkSortType || (exports.SharkSortType = {}));
/**
 * Placeholder for a column sort
 */
var SharkCurrentSort = (function () {
    function SharkCurrentSort() {
    }
    return SharkCurrentSort;
}());

var SharkTablePaginationComponent = (function () {
    function SharkTablePaginationComponent(elementRef) {
        this.elementRef = elementRef;
        this.pageCount = [];
        this.first = false;
        this.last = false;
        this.previous = false;
        this.next = false;
        this.displayedPages = [];
        this.paginationChange = new core.EventEmitter();
    }
    SharkTablePaginationComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        if (changes.hasOwnProperty('page') && this.page) {
            this.pageCount = Array.from(Array(this.page.totalPages), function (x, i) { return i; });
            this.first = this.page.number === 0;
            this.last = this.page.number === this.pageCount.length - 1;
            this.previous = !this.first;
            this.next = !this.last;
            if (this.pageCount.length > 3) {
                if (this.first) {
                    this.displayedPages = [0, 1, 2];
                }
                else if (this.last) {
                    this.displayedPages = [this.page.number - 2, this.page.number - 1, this.page.number];
                }
                else {
                    this.displayedPages = [this.page.number - 1, this.page.number, this.page.number + 1];
                }
            }
            else {
                this.displayedPages = this.pageCount;
            }
            // fix focus when a button disappears
            if (this.lastButton) {
                setTimeout(function () {
                    if (!_this.elementRef.nativeElement.ownerDocument.getElementById(_this.lastButton)) {
                        var activeButton = _this.elementRef.nativeElement.ownerDocument.getElementById('active-button');
                        if (activeButton) {
                            activeButton.focus();
                        }
                    }
                    _this.lastButton = undefined;
                }, 100);
            }
        }
    };
    SharkTablePaginationComponent.prototype.changePage = function (pageNo) {
        this.lastButton = this.elementRef.nativeElement.ownerDocument.activeElement.id;
        this.paginationChange.emit(pageNo);
    };
    SharkTablePaginationComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'shark-table-pagination',
                    template: "\n      <div class=\"pagination-wrapper\" *ngIf=\"pageCount.length > 1\">\n          <div class=\"pagination\">\n              <button id=\"first-page-button\" *ngIf=\"!first\" (click)=\"changePage(0)\" type=\"button\" class=\"fa fa-angle-double-left\">\n                <span class=\"screen-reader-button-label\">First Page</span>\n              </button>\n              <button id=\"previous-page-button\" *ngIf=\"previous\" (click)=\"changePage(page.number - 1)\" type=\"button\" class=\"fa fa-angle-left\">\n                <span class=\"screen-reader-button-label\">Previous Page</span>\n              </button>\n            \n              <ng-container *ngFor=\"let num of displayedPages\">\n                <button \n                  [attr.id]=\"num === page.number ? 'active-button' : null\"\n                  [ngClass]=\"{'active': num === page.number, 'inactive': num!== page.number }\"\n                  [attr.aria-current]=\"num === page.number ? 'true' : null\"\n                  [attr.aria-disabled]=\"num === page.number ? 'true' : null\"\n                  (click)=\"changePage(num)\" type=\"button\">\n                  <span class=\"screen-reader-button-label\">Page</span>\n                  {{ num + 1 }}\n                </button>\n              </ng-container>\n            \n              <button id=\"next-page-button\" *ngIf=\"next\" (click)=\"changePage(page.number + 1)\" type=\"button\" class=\"fa fa-angle-right\">\n                <span class=\"screen-reader-button-label\">Next Page</span>\n              </button>\n              <button id=\"last-page-button\" *ngIf=\"!last\" (click)=\"changePage(pageCount.length - 1)\" type=\"button\" class=\"fa fa-angle-double-right\">\n                <span class=\"screen-reader-button-label\">Last Page</span>\n              </button>\n          </div>\n      </div>\n  "
                },] },
    ];
    /** @nocollapse */
    SharkTablePaginationComponent.ctorParameters = function () { return [
        { type: core.ElementRef, },
    ]; };
    SharkTablePaginationComponent.propDecorators = {
        'page': [{ type: core.Input },],
        'paginationChange': [{ type: core.Output },],
    };
    return SharkTablePaginationComponent;
}());

var SharkTableHeaderComponent = (function () {
    function SharkTableHeaderComponent(document) {
        this.document = document;
        this.sortChange = new core.EventEmitter();
        this.filterChange = new core.EventEmitter();
        this.columnChange = new core.EventEmitter();
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
        { type: core.Component, args: [{
                    selector: '[shark-table-header]',
                    template: "\n        <tr class=\"header-row header-border\" *ngIf=\"columns.length > 0\">\n            <th id=\"childHeader\" *ngIf=\"childRows\" class=\"child-spacer\">\n              <span class=\"screen-reader\">Details</span>\n            </th>\n            <th class=\"header-buttons\" [ngClass]=\"{'right': column.alignRight }\"\n                *ngFor=\"let column of columns; let i = index; let f = first; let l = last;\" \n                [attr.id]=\"column.property\"\n                [attr.aria-sort]=\"(!sortable || column.unsortable) ? null : (!column.sortType || column.sortType === 0) ? 'none' : column.sortType === 1 ? 'ascending' : 'descending'\">\n                <button *ngIf=\"columnOrdering && !f\" (click)=\"moveColumnBackward(i, column)\" type=\"button\" class=\"ordering-button fa fa-angle-left\" [id]=\"column.property + '-left'\">\n                  <span class=\"screen-reader-button-label\">{{ 'Move the ' + column.header + ' column left' }}</span>\n                </button>\n                <shark-table-header-button *ngIf=\"sortable && !column.unsortable\" [column]=\"column\" (sortChange)=\"dispatchSortChangeEvent($event)\"></shark-table-header-button>\n                <ng-container *ngIf=\"!sortable || column.unsortable\">\n                  {{ column.header }}\n                </ng-container>\n                <button *ngIf=\"columnOrdering && !l\" (click)=\"moveColumnForward(i, column)\" type=\"button\" class=\"ordering-button fa fa-angle-right\" [id]=\"column.property + '-right'\">\n                  <span class=\"screen-reader-button-label\">{{ 'Move the ' + column.header + ' column right' }}</span>\n                </button>\n                <div *ngIf=\"columnFiltering && filterable\">\n                  <label [for]=\"'column-' + i\" class=\"screen-reader\">{{ column.header }} filter</label>\n                  <input type=\"text\" name=\"column{{i}}\" [id]=\"'column-' + i\" [(ngModel)]=\"column.filter\" (ngModelChange)=\"fireFilterChange()\" [attr.placeholder]=\"showFilterPlaceholders ? (column.header + ' filter') : null\" />\n                </div>\n            </th>\n        </tr>\n    "
                },] },
    ];
    /** @nocollapse */
    SharkTableHeaderComponent.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: core.Inject, args: [common.DOCUMENT,] },] },
    ]; };
    SharkTableHeaderComponent.propDecorators = {
        'sortable': [{ type: core.Input },],
        'columns': [{ type: core.Input },],
        'columnOrdering': [{ type: core.Input },],
        'childRows': [{ type: core.Input },],
        'page': [{ type: core.Input },],
        'filterable': [{ type: core.Input },],
        'columnFiltering': [{ type: core.Input },],
        'filter': [{ type: core.Input },],
        'showFilterPlaceholders': [{ type: core.Input },],
        'notifierService': [{ type: core.Input },],
        'localPagingSize': [{ type: core.Input },],
        'sortChange': [{ type: core.Output },],
        'filterChange': [{ type: core.Output },],
        'columnChange': [{ type: core.Output },],
    };
    return SharkTableHeaderComponent;
}());

var SharkTableFooterComponent = (function () {
    function SharkTableFooterComponent(tableUtils) {
        this.tableUtils = tableUtils;
        this.start = 0;
        this.end = 0;
        this.total = 0;
        this.filtered = false;
        this.currentPageInfo = '';
        this.filterChange = new core.EventEmitter();
        this.paginationChange = new core.EventEmitter();
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
        { type: core.Component, args: [{
                    selector: 'shark-table-footer',
                    template: "\n  <div class=\"info-footer\">\n    <div class=\"page-size-controls\" *ngIf=\"localPaging && showLocalPagingOptions && columns.length > 0\">\n      <label for=\"local-paging-size\" class=\"local-paging-options\">\n        Rows per page:\n      </label>\n      <select [(ngModel)]=\"localPagingSize\" (change)=\"firePageSizeChange()\" name=\"localPagingSize\" id=\"local-paging-size\">\n        <option *ngFor=\"let option of localPagingOptions\" [value]=\"option\" [attr.selected]=\"option === localPagingSize ? 'selected' : null\">{{ option }}</option>\n      </select>\n      <span>{{ currentPageInfo }}</span>\n    </div>\n    <shark-table-pagination *ngIf=\"columns.length > 0\" [page]=\"page\" (paginationChange)=\"changePage($event)\"></shark-table-pagination>\n  </div>"
                },] },
    ];
    /** @nocollapse */
    SharkTableFooterComponent.ctorParameters = function () { return [
        { type: SharkTableUtils, },
    ]; };
    SharkTableFooterComponent.propDecorators = {
        'paginationComponent': [{ type: core.ViewChild, args: [SharkTablePaginationComponent,] },],
        'notifierService': [{ type: core.Input },],
        'localPaging': [{ type: core.Input },],
        'localPagingSize': [{ type: core.Input },],
        'localPagingOptions': [{ type: core.Input },],
        'showLocalPagingOptions': [{ type: core.Input },],
        'page': [{ type: core.Input },],
        'columns': [{ type: core.Input },],
        'filter': [{ type: core.Input },],
        'filterChange': [{ type: core.Output },],
        'paginationChange': [{ type: core.Output },],
    };
    return SharkTableFooterComponent;
}());

var SharkColumnDropdownComponent = (function () {
    function SharkColumnDropdownComponent(elementRef) {
        this.elementRef = elementRef;
        this.columnChange = new core.EventEmitter();
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
        { type: core.Component, args: [{
                    selector: 'shark-column-dropdown',
                    template: "\n    <span class=\"column-picker\">\n        <button class=\"toggle-dropdown\" (click)=\"showDropDown = !showDropDown\" [attr.aria-expanded]=\"showDropDown\" aria-controls=\"column-picker-dropdown\" type=\"button\" #dropdownButton>\n          <span>Choose Columns<i class=\"fa fa-fw fa-angle-down\"></i></span>\n        </button>\n        <div id=\"column-picker-dropdown\" class=\"dropdown\" [attr.aria-hidden]=\"!showDropDown\" aria-label=\"submenu\" [ngStyle]=\"{'display': showDropDown ? 'block': 'none'}\">\n          <fieldset>\n            <legend class=\"screen-reader\">Columns to display</legend>\n            <label *ngFor=\"let column of columns\">\n              <input type=\"checkbox\" [(ngModel)]=\"column.displayed\" (ngModelChange)=\"emitSelected(column)\" />\n              {{ column.header }}\n            </label>\n          </fieldset>\n        </div>\n    </span>\n  "
                },] },
    ];
    /** @nocollapse */
    SharkColumnDropdownComponent.ctorParameters = function () { return [
        { type: core.ElementRef, },
    ]; };
    SharkColumnDropdownComponent.propDecorators = {
        'dropdownButton': [{ type: core.ViewChild, args: ['dropdownButton',] },],
        'columns': [{ type: core.Input },],
        'notifierService': [{ type: core.Input },],
        'columnChange': [{ type: core.Output },],
        'closeDropDownWithEscape': [{ type: core.HostListener, args: ['document:keydown.escape', [],] },],
        'closeDropDown': [{ type: core.HostListener, args: ['document:click', ['$event'],] }, { type: core.HostListener, args: ['document:touchstart', ['$event'],] },],
    };
    return SharkColumnDropdownComponent;
}());

var SharkTableInfoHeaderComponent = (function () {
    function SharkTableInfoHeaderComponent() {
        this.filterChange = new core.EventEmitter();
        this.columnChange = new core.EventEmitter();
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
        { type: core.Component, args: [{
                    selector: 'shark-table-info-header',
                    template: "\n    <div class=\"info-header\">\n      <div class=\"controls header-buttons\">\n        <button class=\"server-refresh fa fa-sync\" *ngIf=\"serverSideData\" (click)=\"fireFilterChange()\" type=\"button\">\n          <span class=\"screen-reader-button-label\">Refresh Server Data</span>\n        </button>\n        <shark-column-dropdown *ngIf=\"columnPicker\" [columns]=\"allColumns\" [notifierService]=\"notifierService\" (columnChange)=\"fireColumnChange($event)\"></shark-column-dropdown>\n        <span class=\"filter-box\" *ngIf=\"filterable && !columnFiltering && columns.length > 0\">\n          <label for=\"filter\" class=\"screen-reader\">Filter Results (all column search)</label>\n          <input #filterInput type=\"text\" name=\"filter\" id=\"filter\" [(ngModel)]=\"filter\" (ngModelChange)=\"fireFilterChange()\" [attr.placeholder]=\"showFilterPlaceholders ? 'Filter Results' : null\" />\n        </span>\n      </div>\n    </div>\n  "
                },] },
    ];
    /** @nocollapse */
    SharkTableInfoHeaderComponent.ctorParameters = function () { return []; };
    SharkTableInfoHeaderComponent.propDecorators = {
        'columnPickerComponent': [{ type: core.ViewChild, args: [SharkColumnDropdownComponent,] },],
        'filterInput': [{ type: core.ViewChild, args: ['filterInput',] },],
        'columns': [{ type: core.Input },],
        'allColumns': [{ type: core.Input },],
        'columnPicker': [{ type: core.Input },],
        'serverSideData': [{ type: core.Input },],
        'filterable': [{ type: core.Input },],
        'columnFiltering': [{ type: core.Input },],
        'filter': [{ type: core.Input },],
        'showFilterPlaceholders': [{ type: core.Input },],
        'localPagingSize': [{ type: core.Input },],
        'notifierService': [{ type: core.Input },],
        'filterChange': [{ type: core.Output },],
        'columnChange': [{ type: core.Output },],
    };
    return SharkTableInfoHeaderComponent;
}());

var NotifierService = (function () {
    function NotifierService() {
        this.messageSubject = new Subject.Subject();
        this.messageObservable = this.messageSubject.asObservable();
    }
    NotifierService.prototype.postMessage = function (message) {
        this.messageSubject.next(message);
    };
    return NotifierService;
}());

var SharkTableComponent = (function () {
    function SharkTableComponent(router$$1, tableUtils) {
        this.router = router$$1;
        this.tableUtils = tableUtils;
        this.notifierService = new NotifierService();
        this.currentColumns = [];
        /**
         * The <caption> text for this table
         * @type {string}
         */
        this.caption = 'A Data Table';
        /**
         * Whether or not the table <caption> should be hidden (screen-reader) only.
         * @type {boolean}
         */
        this.hideCaption = false;
        /**
         * Allow users to turn columns on and off
         * @type {boolean}
         */
        this.columnPicker = false;
        /**
         * Allow users to reorder columns with header buttons
         * @type {boolean}
         */
        this.columnOrdering = false;
        /**
         * Enables the sorting headers
         * @type {boolean}
         */
        this.sortable = true;
        /**
         * Enables the global filter text box
         * @type {boolean}
         */
        this.filterable = true;
        /**
         * Enables column specific filter boxes
         * @type {boolean}
         */
        this.columnFiltering = false;
        /**
         * Enables client-side filtering as opposed to just emitting a `SharkPageChangeEvent`
         * @type {boolean}
         */
        this.localFilter = true;
        /**
         * Enables the placeholder text for the filter boxes
         * @type {boolean}
         */
        this.showFilterPlaceholders = true;
        /**
         * Enables client-side pagination as opposed to just emitting a `SharkPageChangeEvent`
         * @type {boolean}
         */
        this.localPaging = true;
        /**
         * The size of each page
         * @type {number}
         */
        this.localPagingSize = 10;
        /**
         * The supported page sizes
         * @type {number[]}
         */
        this.localPagingOptions = [10, 20, 100];
        /**
         * Enables the drop down for changing the page size
         * @type {boolean}
         */
        this.showLocalPagingOptions = true;
        /**
         * Shows a button that when clicked, emits a `SharkPageChangeEvent`
         * @type {boolean}
         */
        this.serverSideData = false;
        this.rowStylingFunction = function (row) { return {}; };
        /**
         * Enables children rows
         * @type {boolean}
         */
        this.childRows = false;
        /**
         * {@link SharkPageChangeEvent} events are emitted from here
         * @type {EventEmitter<SharkPageChangeEvent>}
         */
        this.pageChange = new core.EventEmitter();
        /**
         * Show the footer with 'Showing x through y of z rows`
         *
         * @type {boolean}
         */
        this.footer = true;
        /**
         * Message to show when the table is empty
         */
        this.tableEmptyMessage = 'This table contains no rows';
    }
    SharkTableComponent.prototype.ngOnInit = function () {
        this.updatePage();
    };
    SharkTableComponent.prototype.ngOnChanges = function (changes) {
        var dataChange = changes['data'];
        var columnChange = changes['columns'];
        if (columnChange && columnChange.isFirstChange()) {
            this.columns = columnChange.currentValue;
            this.columns.forEach(function (column) { return column.displayed = true; });
            this.currentColumns = this.columns;
        }
        if (dataChange && !dataChange.isFirstChange()) {
            this.updatePage();
        }
        else if (columnChange && !columnChange.isFirstChange()) {
            this.currentColumns = columnChange.currentValue;
            this.emitCurrent();
        }
    };
    SharkTableComponent.prototype.ngOnDestroy = function () {
        if (this.dataSubscription) {
            this.dataSubscription.unsubscribe();
        }
        if (this.localSubscription) {
            this.localSubscription.unsubscribe();
        }
    };
    SharkTableComponent.prototype.updateCurrentColumns = function (newColumns) {
        this.currentColumns = newColumns.filter(function (value) { return value.displayed; });
        this.emitCurrent();
    };
    /**
     * Emits a {@link SharkPageChangeEvent} with the current information. This event should be consumed by the host
     * component and sent to a REST endpoint to update the data.
     */
    SharkTableComponent.prototype.emitCurrent = function () {
        this.pageChange.emit({
            pageNo: this.page.number,
            columns: this.currentColumns,
            sortString: this.generateSortString(),
            sorts: this.generateSortArray(),
            filter: this.filter
        });
    };
    SharkTableComponent.prototype.headerChange = function (event) {
        this.columns = event.columns;
        this.currentColumns = this.columns.filter(function (value) { return value.displayed; });
        this.filter = event.filter;
        this.localPagingSize = event.localPagingSize;
        this.emitCurrent();
    };
    SharkTableComponent.prototype.changePage = function (pageNo) {
        this.pageChange.emit({
            pageNo: pageNo,
            columns: this.currentColumns,
            sortString: this.generateSortString(),
            sorts: this.generateSortArray(),
            filter: this.filter
        });
    };
    SharkTableComponent.prototype.changeSort = function (columnProperty, sortType) {
        var _this = this;
        if (this.sortable) {
            this.currentColumns.forEach(function (column) {
                if (column.property === columnProperty) {
                    // State Machine
                    // ASC -> DESC -> NONE -> ASC
                    switch (sortType) {
                        case exports.SharkSortType.ASC: {
                            // -> DESC
                            column.sortType = exports.SharkSortType.DESC;
                            break;
                        }
                        case exports.SharkSortType.DESC: {
                            // -> NONE
                            column.sortType = exports.SharkSortType.NONE;
                            break;
                        }
                        case exports.SharkSortType.NONE:
                        default: {
                            // -> ASC
                            column.sortType = exports.SharkSortType.ASC;
                            break;
                        }
                    }
                    _this.notifierService.postMessage((column.sortType === exports.SharkSortType.DESC ? 'sorted descending' : column.sortType === exports.SharkSortType.ASC ? 'sorted ascending' : 'unsorted'));
                }
            });
            var sorts = this.generateSortArray();
            if (!this.serverSideData) {
                // sort internally
                this.sort(this.page.content, sorts);
            }
            this.pageChange.emit({
                pageNo: this.page.number,
                columns: this.currentColumns,
                sortString: this.generateSortString(),
                sorts: sorts,
                filter: this.filter
            });
        }
    };
    /**
     * Currently only works if your input is an any[], returns the current "view" into the table with filtering/column selection
     * @param {boolean} rendered If you would like inline pipes to be applied to the exported data
     *
     * @returns {SharkTableCurrentDataEvent}
     */
    SharkTableComponent.prototype.exportCurrentData = function (rendered) {
        var _this = this;
        if (rendered === void 0) { rendered = true; }
        var currentData;
        if (this.localFilter && (this.columnFiltering && this.tableUtils.hasFilter(this.currentColumns) || (this.filter && this.filter.length > 0))) {
            currentData = this.tableUtils.filter(this.data, this.currentColumns, this.columnFiltering, this.filter);
            this.sort(currentData, this.generateSortArray());
        }
        else {
            currentData = this.data;
        }
        if (this.currentColumns.length === 0) {
            return {
                data: [],
                columns: []
            };
        }
        return {
            data: currentData.map(function (row) { return _this.tableUtils.exportRow(row, _this.currentColumns, rendered); }),
            columns: this.currentColumns
        };
    };
    SharkTableComponent.prototype.generateSortString = function () {
        var sortString = '';
        this.currentColumns.forEach(function (column) {
            switch (column.sortType) {
                case exports.SharkSortType.ASC: {
                    sortString += '' + column.property + ';';
                    break;
                }
                case exports.SharkSortType.DESC: {
                    sortString += '-' + column.property + ';';
                    break;
                }
                case exports.SharkSortType.NONE: {
                    break;
                }
            }
        });
        return sortString;
    };
    SharkTableComponent.prototype.generateSortArray = function () {
        var currentSorts = [];
        this.currentColumns.forEach(function (column) {
            switch (column.sortType) {
                case exports.SharkSortType.ASC:
                case exports.SharkSortType.DESC: {
                    currentSorts.push({ property: column.property, sortType: column.sortType });
                    break;
                }
            }
        });
        return currentSorts;
    };
    SharkTableComponent.prototype.sort = function (content, sorts) {
        var _this = this;
        var columnCache = {};
        this.columns.forEach(function (column) { return columnCache[column.property] = column; });
        content.sort(function (a, b) {
            var result = 0;
            sorts.forEach(function (sort) {
                if (result === 0) {
                    var aVal = _this.tableUtils.findValue(a, sort.property);
                    var bVal = _this.tableUtils.findValue(b, sort.property);
                    var sortFunction = columnCache[sort.property].ascendingSortFunction;
                    if (!!sortFunction) {
                        result = sortFunction(aVal, bVal);
                    }
                    else if (!isNaN(Number(aVal)) && !isNaN(Number(bVal))) {
                        result = aVal - bVal;
                    }
                    else {
                        result = (aVal < bVal) ? -1 : (aVal > bVal) ? 1 : 0;
                    }
                    result *= (sort.sortType === exports.SharkSortType.DESC) ? -1 : 1;
                }
            });
            return result;
        });
    };
    SharkTableComponent.prototype.updatePage = function () {
        if (this.data) {
            if (this.data.constructor === Array) {
                this.setupPageArray();
            }
            else if (this.data.constructor === Observable.Observable) {
                this.setupPageSubscription();
            }
            else {
                this.page = this.data;
                if (!this.page.number) {
                    this.page.number = 0;
                }
            }
            this.setupInitialSort();
        }
    };
    SharkTableComponent.prototype.createLocalPage = function (data) {
        var total = (data ? data : this.data).length;
        return {
            number: 0,
            totalPages: 1,
            totalElements: total,
            first: true,
            last: true,
            numberOfElements: total,
            content: data ? data : this.data
        };
    };
    SharkTableComponent.prototype.setupPageArray = function () {
        var _this = this;
        if (this.localPaging) {
            var total = this.data.length;
            var pageCount = Math.ceil(total / this.localPagingSize);
            this.page = {
                number: 0,
                totalPages: pageCount,
                totalElements: total,
                first: true,
                last: false,
                numberOfElements: this.localPagingSize,
                content: this.data.slice(0, this.localPagingSize)
            };
            if (this.localSubscription) {
                this.localSubscription.unsubscribe();
            }
            this.localSubscription = this.pageChange.subscribe(function (event) { return _this.calculateLocalPage(event); });
        }
        else if (this.localFilter) {
            this.page = this.createLocalPage();
            if (this.localSubscription) {
                this.localSubscription.unsubscribe();
            }
            this.localSubscription = this.pageChange.subscribe(function (event) { return _this.calculateLocalPageNoPagination(event); });
        }
        else {
            this.page = this.createLocalPage();
        }
    };
    SharkTableComponent.prototype.calculateLocalPageNoPagination = function (event) {
        if (((event.filter && event.filter.length > 0)) || this.tableUtils.hasFilter(event.columns)) {
            var filteredContent = this.tableUtils.filter(this.data, this.currentColumns, this.columnFiltering, event.filter);
            this.page = {
                number: 0,
                totalPages: 1,
                totalElements: filteredContent.length,
                first: true,
                last: false,
                numberOfElements: filteredContent.length,
                content: filteredContent
            };
        }
        else {
            this.page = this.createLocalPage();
        }
    };
    SharkTableComponent.prototype.calculateLocalPage = function (event) {
        var content;
        if (this.localFilter && ((event.filter && event.filter.length > 0)) || this.tableUtils.hasFilter(event.columns)) {
            content = this.tableUtils.filter(this.data, this.currentColumns, this.columnFiltering, event.filter);
        }
        else {
            content = this.data;
        }
        this.sort(content, this.generateSortArray());
        var total = content.length;
        // IntelliJ claims this * 1 call is useless, but we need to make sure it's a number
        var pageSize = (this.localPagingSize > content.length ? content.length : this.localPagingSize) * 1;
        var pageCount = total === 0 ? 0 : Math.ceil(total / pageSize);
        var pageNo = event.pageNo > pageCount || content.length <= pageSize ? 0 : event.pageNo;
        var sliceRange = pageSize * pageNo + pageSize;
        var displayedContent = content.slice((pageSize * pageNo), sliceRange);
        this.page = {
            number: pageNo,
            totalPages: pageCount,
            totalElements: total,
            first: pageNo === 0,
            last: pageNo === pageCount,
            numberOfElements: pageSize,
            content: displayedContent
        };
    };
    SharkTableComponent.prototype.setupPageSubscription = function () {
        var _this = this;
        // Fix potential memory leak, by unsubscribing to previous subscription if exists
        if (this.dataSubscription) {
            this.dataSubscription.unsubscribe();
        }
        this.dataSubscription = this.data.subscribe(function (data) {
            if (data.constructor === Array) {
                _this.page = _this.createLocalPage(data);
            }
            else {
                _this.page = data;
            }
        });
    };
    SharkTableComponent.prototype.setupInitialSort = function () {
        var _this = this;
        if (this.initialSort) {
            var sorts = this.initialSort.split(';');
            sorts.forEach(function (sort) {
                _this.columns.forEach(function (column) {
                    var type = exports.SharkSortType.NONE;
                    var property = sort;
                    if (sort.startsWith('-')) {
                        type = exports.SharkSortType.DESC;
                        property = property.substr(1);
                    }
                    else {
                        type = exports.SharkSortType.ASC;
                    }
                    if (property === column.property) {
                        column.sortType = type;
                    }
                });
            });
            this.changeSort('', undefined);
        }
        if (this.page.sorts && this.page.sorts.length > 0) {
            this.columns.forEach(function (column) {
                _this.page.sorts.forEach(function (sort) {
                    if (column.property === sort.property) {
                        column.sortType = exports.SharkSortType.NONE;
                        if (sort.ascending) {
                            column.sortType = exports.SharkSortType.ASC;
                        }
                        else if (sort.descending) {
                            column.sortType = exports.SharkSortType.DESC;
                        }
                    }
                });
            });
            if (!this.serverSideData) {
                this.changeSort('', undefined);
            }
        }
    };
    SharkTableComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'shark-table',
                    template: "\n      <shark-table-aria-notifier [notifierService]=\"notifierService\"></shark-table-aria-notifier>\n      <div class=\"table-wrapper\" *ngIf=\"page\">\n        <shark-table-info-header *ngIf=\"(serverSideData || (filterable && !columnFiltering) || columnPicker)\"\n                                 [serverSideData]=\"serverSideData\"\n                                 [filterable]=\"filterable\"\n                                 [columnFiltering]=\"columnFiltering\"\n                                 [columnPicker]=\"columnPicker\"\n                                 [columns]=\"currentColumns\"\n                                 [allColumns]=\"columns\"\n                                 [filter]=\"filter\"\n                                 [showFilterPlaceholders]=\"showFilterPlaceholders\"\n                                 [localPagingSize]=\"localPagingSize\"\n                                 [notifierService]=\"notifierService\"\n                                 (filterChange)=\"headerChange($event)\"\n                                 (columnChange)=\"updateCurrentColumns($event)\"\n        ></shark-table-info-header>\n        <table>\n            <caption [ngClass]=\"{'screen-reader': hideCaption}\">{{ caption }}</caption>\n            <thead shark-table-header\n                   [sortable]=\"sortable\"\n                   [columns]=\"currentColumns\"\n                   [columnOrdering]=\"columnOrdering\"\n                   [childRows]=\"childRows\"\n                   [page]=\"page\"\n                   [filterable]=\"filterable\"\n                   [columnFiltering]=\"columnFiltering\"\n                   [localPagingSize]=\"localPagingSize\"\n                   [filter]=\"filter\"\n                   [showFilterPlaceholders]=\"showFilterPlaceholders\"\n                   [notifierService]=\"notifierService\"\n                   (sortChange)=\"changeSort($event.property, $event.sortType)\"\n                   (filterChange)=\"headerChange($event)\"\n                   (columnChange)=\"updateCurrentColumns($event)\"\n            ></thead>\n            <tbody shark-table-body\n                   [currentColumns]=\"currentColumns\"\n                   [columns]=\"columns\"\n                   [localFilter]=\"localFilter\"\n                   [localPaging]=\"localPaging\"\n                   [columnFiltering]=\"columnFiltering\"\n                   [filter]=\"filter\"\n                   [childRows]=\"childRows\"\n                   [childComponent]=\"childComponent\"\n                   [linkTarget]=\"linkTarget\" [linkKey]=\"linkKey\"\n                   [page]=\"page\"\n                   [tableEmptyMessage]=\"tableEmptyMessage\"\n                   [rowStylingFunction]=\"rowStylingFunction\"\n                   [cellStylingFunction]=\"cellStylingFunction\"\n            ></tbody>\n        </table>\n        <shark-table-footer *ngIf=\"footer && currentColumns.length > 0\"\n                            [page]=\"page\"\n                            [columns]=\"currentColumns\"\n                            [filter]=\"filter\"\n                            [localPaging]=\"localPaging\"\n                            [localPagingSize]=\"localPagingSize\"\n                            [localPagingOptions]=\"localPagingOptions\"\n                            [showLocalPagingOptions]=\"showLocalPagingOptions\"\n                            [notifierService]=\"notifierService\"\n                            (filterChange)=\"headerChange($event)\"\n                            (paginationChange)=\"changePage($event)\"\n        ></shark-table-footer>\n      </div>\n  "
                },] },
    ];
    /** @nocollapse */
    SharkTableComponent.ctorParameters = function () { return [
        { type: router.Router, },
        { type: SharkTableUtils, },
    ]; };
    SharkTableComponent.propDecorators = {
        'headerInfoComponent': [{ type: core.ViewChild, args: [SharkTableInfoHeaderComponent,] },],
        'headerComponent': [{ type: core.ViewChild, args: [SharkTableHeaderComponent,] },],
        'footerComponent': [{ type: core.ViewChild, args: [SharkTableFooterComponent,] },],
        'data': [{ type: core.Input },],
        'columns': [{ type: core.Input },],
        'caption': [{ type: core.Input },],
        'hideCaption': [{ type: core.Input },],
        'columnPicker': [{ type: core.Input },],
        'columnOrdering': [{ type: core.Input },],
        'linkTarget': [{ type: core.Input },],
        'linkKey': [{ type: core.Input },],
        'sortable': [{ type: core.Input },],
        'filterable': [{ type: core.Input },],
        'columnFiltering': [{ type: core.Input },],
        'localFilter': [{ type: core.Input },],
        'showFilterPlaceholders': [{ type: core.Input },],
        'localPaging': [{ type: core.Input },],
        'localPagingSize': [{ type: core.Input },],
        'localPagingOptions': [{ type: core.Input },],
        'showLocalPagingOptions': [{ type: core.Input },],
        'serverSideData': [{ type: core.Input },],
        'initialSort': [{ type: core.Input },],
        'rowStylingFunction': [{ type: core.Input },],
        'cellStylingFunction': [{ type: core.Input },],
        'childRows': [{ type: core.Input },],
        'childComponent': [{ type: core.Input },],
        'pageChange': [{ type: core.Output },],
        'filter': [{ type: core.Input },],
        'footer': [{ type: core.Input },],
        'tableEmptyMessage': [{ type: core.Input },],
    };
    return SharkTableComponent;
}());

var LocalFilterPipe = (function () {
    function LocalFilterPipe(tableUtils) {
        this.tableUtils = tableUtils;
    }
    LocalFilterPipe.prototype.transform = function (items, cols, localFilter, localPaging, columnFiltering, filterText) {
        if (localFilter && (columnFiltering && this.tableUtils.hasFilter(cols) || (filterText && filterText.length > 0))) {
            return this.tableUtils.filter(items, cols, columnFiltering, filterText);
        }
        return items;
    };
    LocalFilterPipe.decorators = [
        { type: core.Pipe, args: [{
                    name: 'localfilter'
                },] },
    ];
    /** @nocollapse */
    LocalFilterPipe.ctorParameters = function () { return [
        { type: SharkTableUtils, },
    ]; };
    return LocalFilterPipe;
}());

var SharkTableCellComponent = (function () {
    function SharkTableCellComponent(tableUtils, componentFactoryResolver, cdr) {
        this.tableUtils = tableUtils;
        this.componentFactoryResolver = componentFactoryResolver;
        this.cdr = cdr;
    }
    SharkTableCellComponent.prototype.ngAfterViewInit = function () {
        this.loadComponent();
    };
    SharkTableCellComponent.prototype.retrieveCell = function (row, column) {
        return this.tableUtils.retrieveCell(row, column);
    };
    SharkTableCellComponent.prototype.loadComponent = function () {
        if (this.column.component) {
            var contents = this.retrieveCell(this.row, this.column);
            var componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.column.component);
            var viewContainerRef = this.tableCellContentsDirective.viewContainerRef;
            viewContainerRef.clear();
            var componentRef = viewContainerRef.createComponent(componentFactory);
            componentRef.instance.data = contents;
            componentRef.instance.row = this.row;
        }
        else {
            this.noComponentContents = this.retrieveCell(this.row, this.column);
        }
        // without this, everything went boom
        this.cdr.detectChanges();
    };
    SharkTableCellComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'shark-table-cell',
                    template: "\n      <ng-container *ngIf=\"column.component\">\n          <ng-template sharkDynamicContents></ng-template>\n      </ng-container>\n\n      <ng-container *ngIf=\"noComponentContents\">\n          {{ noComponentContents }}\n      </ng-container>\n  "
                },] },
    ];
    /** @nocollapse */
    SharkTableCellComponent.ctorParameters = function () { return [
        { type: SharkTableUtils, },
        { type: core.ComponentFactoryResolver, },
        { type: core.ChangeDetectorRef, },
    ]; };
    SharkTableCellComponent.propDecorators = {
        'column': [{ type: core.Input },],
        'row': [{ type: core.Input },],
        'tableCellContentsDirective': [{ type: core.ViewChild, args: [SharkDynamicContentsDirective,] },],
    };
    return SharkTableCellComponent;
}());

/**
 * This component controls each row in the table.
 */
var SharkTableBodyComponent = (function () {
    function SharkTableBodyComponent(router$$1, tableUtils) {
        this.router = router$$1;
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
        { type: core.Component, args: [{
                    selector: '[shark-table-body]',
                    template: "\n        <ng-container *ngIf=\"page.content && currentColumns.length > 0\">\n          <ng-container *ngFor=\"let row of (page.content | localfilter:currentColumns:localFilter:localPaging:columnFiltering:filter); let e = even; let o = odd; let i = index;\">\n            <tr class=\"data-row\"\n                [ngClass]=\"{ odd: o, even: e, rowLink: linkTarget, rowOpen: childOpen(i) }\"\n                [ngStyle]=\"rowStylingFunction(row)\"\n                (click)=\"rowClick(row)\" (keyup.enter)=\"rowClick(row)\"\n                [attr.tabindex]=\"linkTarget ? 0 : null\"\n            >\n                <td class=\"header-buttons\" *ngIf=\"childRows\">\n                  <button class=\"black-arrow fa fa-fw\"\n                          [attr.aria-expanded]=\"childOpen(i)\"\n                          [ngClass]=\"{ 'open': childOpen(i), 'closed': !childOpen(i), 'fa-caret-down': childOpen(i), 'fa-caret-right': !childOpen(i) }\"\n                          (click)=\"toggleChild(i)\" type=\"button\" aria-label=\"Details Row\"\n                  >\n                  </button>\n                </td>\n                <ng-container *ngFor=\"let column of currentColumns\">\n                    <td [ngClass]=\"{'right': column.alignRight }\" [ngStyle]=\"addStyleToCell(row, column)\">\n                        <shark-table-cell [column]=\"column\" [row]=\"row\"></shark-table-cell>\n                    </td>\n                </ng-container>\n            </tr>\n            <tr *ngIf=\"childRows\" class=\"data-row child-row\" [ngClass]=\"{ odd: o, even: e, rowOpen: childOpen(i) }\" [hidden]=\"!childOpen(i)\">\n                <td></td>\n                <td [attr.colspan]=\"currentColumns.length\">\n                    <shark-child [component]=\"childComponent\" [row]=\"row\" [rowIndex]=\"i\" [openChildren]=\"openChildren\"></shark-child>\n                </td>\n            </tr>\n          </ng-container>\n        </ng-container>\n        <ng-container *ngIf=\"currentColumns.length === 0\">\n          <tr><td [attr.colspan]=\"childRows ? columns.length + 1 : columns.length\">There are no columns selected</td></tr>\n        </ng-container>\n        <ng-container *ngIf=\"(!page.content || page.content.length == 0) && currentColumns.length > 0\">\n          <tr><td [attr.colspan]=\"childRows ? currentColumns.length + 1 : currentColumns.length\">{{ tableEmptyMessage }}</td></tr>\n        </ng-container>\n    "
                },] },
    ];
    /** @nocollapse */
    SharkTableBodyComponent.ctorParameters = function () { return [
        { type: router.Router, },
        { type: SharkTableUtils, },
    ]; };
    SharkTableBodyComponent.propDecorators = {
        'currentColumns': [{ type: core.Input },],
        'columns': [{ type: core.Input },],
        'localFilter': [{ type: core.Input },],
        'localPaging': [{ type: core.Input },],
        'columnFiltering': [{ type: core.Input },],
        'filter': [{ type: core.Input },],
        'rowStylingFunction': [{ type: core.Input },],
        'cellStylingFunction': [{ type: core.Input },],
        'childRows': [{ type: core.Input },],
        'childComponent': [{ type: core.Input },],
        'linkTarget': [{ type: core.Input },],
        'linkKey': [{ type: core.Input },],
        'tableEmptyMessage': [{ type: core.Input },],
        'page': [{ type: core.Input },],
    };
    return SharkTableBodyComponent;
}());

var SharkTableHeaderButtonComponent = (function () {
    function SharkTableHeaderButtonComponent() {
        this.sortChange = new core.EventEmitter();
        this.ariaButtonLabel = 'Change Sorting';
    }
    SharkTableHeaderButtonComponent.prototype.changeSort = function () {
        this.sortChange.emit({
            property: this.column.property,
            sortType: this.column.sortType
        });
    };
    SharkTableHeaderButtonComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'shark-table-header-button',
                    template: "\n    <span class=\"header-text pointer\" (click)=\"changeSort()\" (keyup.enter)=\"changeSort()\">{{ column.header }}</span>\n    <button class=\"sort-button\" [name]=\"column.header\" (click)=\"changeSort()\" type=\"button\" aria-label=\"Change Sorting\">\n      <i class=\"sorting fas fa-fw\" [ngClass]=\"{\n        'unsorted': !column.sortType || column.sortType === 0,\n        'fa-sort': !column.sortType || column.sortType === 0,\n        'asc': column.sortType === 1,\n        'fa-sort-up': column.sortType === 1,\n        'desc': column.sortType === 2,\n        'fa-sort-down': column.sortType === 2\n      }\"></i>\n    </button>\n  "
                },] },
    ];
    /** @nocollapse */
    SharkTableHeaderButtonComponent.ctorParameters = function () { return []; };
    SharkTableHeaderButtonComponent.propDecorators = {
        'column': [{ type: core.Input },],
        'sortChange': [{ type: core.Output },],
    };
    return SharkTableHeaderButtonComponent;
}());

var AriaNotifierComponent = (function () {
    function AriaNotifierComponent() {
    }
    AriaNotifierComponent.prototype.ngOnChanges = function (changes) {
        if (changes.hasOwnProperty('notifierService')) {
            if (!this.notifierSubscription) {
                this.subscribeToNotifier();
            }
            else {
                this.notifierSubscription.unsubscribe();
                this.subscribeToNotifier();
            }
        }
    };
    AriaNotifierComponent.prototype.ngOnDestroy = function () {
        if (this.notifierSubscription) {
            this.notifierSubscription.unsubscribe();
        }
    };
    AriaNotifierComponent.prototype.subscribeToNotifier = function () {
        var _this = this;
        this.notifierSubscription = this.notifierService.messageObservable.subscribe(function (message) {
            _this.status = message;
            setTimeout(function () { return _this.status = ''; }, 1000);
        });
    };
    AriaNotifierComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'shark-table-aria-notifier',
                    template: "<div class=\"notification-area screen-reader\" aria-atomic=\"true\" aria-live=\"polite\">{{ status }}</div>"
                },] },
    ];
    /** @nocollapse */
    AriaNotifierComponent.ctorParameters = function () { return []; };
    AriaNotifierComponent.propDecorators = {
        'notifierService': [{ type: core.Input },],
    };
    return AriaNotifierComponent;
}());

var SharkTableModule = (function () {
    function SharkTableModule() {
    }
    SharkTableModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [
                        common.CommonModule,
                        forms.FormsModule,
                        router.RouterModule
                    ],
                    declarations: [
                        AriaNotifierComponent,
                        SharkTableComponent,
                        SharkChildComponent,
                        SharkDynamicContentsDirective,
                        SharkTableCellComponent,
                        SharkTableHeaderComponent,
                        SharkTableHeaderButtonComponent,
                        SharkTableInfoHeaderComponent,
                        SharkTableFooterComponent,
                        SharkTablePaginationComponent,
                        SharkTableBodyComponent,
                        LocalFilterPipe,
                        SharkColumnDropdownComponent
                    ],
                    exports: [
                        SharkTableComponent,
                        SharkTablePaginationComponent
                    ],
                    providers: [
                        SharkTableUtils
                    ]
                },] },
    ];
    /** @nocollapse */
    SharkTableModule.ctorParameters = function () { return []; };
    return SharkTableModule;
}());

var SharkTableCurrentDataEvent = (function () {
    function SharkTableCurrentDataEvent() {
    }
    return SharkTableCurrentDataEvent;
}());

exports.SharkChildComponent = SharkChildComponent;
exports.SharkCurrentSort = SharkCurrentSort;
exports.SharkTableModule = SharkTableModule;
exports.SharkTableCellComponent = SharkTableCellComponent;
exports.SharkTableComponent = SharkTableComponent;
exports.SharkTablePaginationComponent = SharkTablePaginationComponent;
exports.SharkTableUtils = SharkTableUtils;
exports.SharkTableCurrentDataEvent = SharkTableCurrentDataEvent;

Object.defineProperty(exports, '__esModule', { value: true });

})));
