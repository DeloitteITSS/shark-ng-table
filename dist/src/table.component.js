import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SharkSortType } from './sort.type';
import { SharkTableUtils } from './table.utils';
import { SharkTableHeaderComponent } from './table.header.component';
import { SharkTableFooterComponent } from './table.footer.component';
import { SharkTableInfoHeaderComponent } from './table.info.header.component';
import { NotifierService } from './notifier/notifier.service';
var SharkTableComponent = (function () {
    function SharkTableComponent(router, tableUtils) {
        this.router = router;
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
        this.pageChange = new EventEmitter();
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
                        case SharkSortType.ASC: {
                            // -> DESC
                            column.sortType = SharkSortType.DESC;
                            break;
                        }
                        case SharkSortType.DESC: {
                            // -> NONE
                            column.sortType = SharkSortType.NONE;
                            break;
                        }
                        case SharkSortType.NONE:
                        default: {
                            // -> ASC
                            column.sortType = SharkSortType.ASC;
                            break;
                        }
                    }
                    _this.notifierService.postMessage((column.sortType === SharkSortType.DESC ? 'sorted descending' : column.sortType === SharkSortType.ASC ? 'sorted ascending' : 'unsorted'));
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
                case SharkSortType.ASC: {
                    sortString += '' + column.property + ';';
                    break;
                }
                case SharkSortType.DESC: {
                    sortString += '-' + column.property + ';';
                    break;
                }
                case SharkSortType.NONE: {
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
                case SharkSortType.ASC:
                case SharkSortType.DESC: {
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
                    result *= (sort.sortType === SharkSortType.DESC) ? -1 : 1;
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
            else if (this.data.constructor === Observable) {
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
                    var type = SharkSortType.NONE;
                    var property = sort;
                    if (sort.startsWith('-')) {
                        type = SharkSortType.DESC;
                        property = property.substr(1);
                    }
                    else {
                        type = SharkSortType.ASC;
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
                        column.sortType = SharkSortType.NONE;
                        if (sort.ascending) {
                            column.sortType = SharkSortType.ASC;
                        }
                        else if (sort.descending) {
                            column.sortType = SharkSortType.DESC;
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
        { type: Component, args: [{
                    selector: 'shark-table',
                    template: "\n      <shark-table-aria-notifier [notifierService]=\"notifierService\"></shark-table-aria-notifier>\n      <div class=\"table-wrapper\" *ngIf=\"page\">\n        <shark-table-info-header *ngIf=\"(serverSideData || (filterable && !columnFiltering) || columnPicker)\"\n                                 [serverSideData]=\"serverSideData\"\n                                 [filterable]=\"filterable\"\n                                 [columnFiltering]=\"columnFiltering\"\n                                 [columnPicker]=\"columnPicker\"\n                                 [columns]=\"currentColumns\"\n                                 [allColumns]=\"columns\"\n                                 [filter]=\"filter\"\n                                 [showFilterPlaceholders]=\"showFilterPlaceholders\"\n                                 [localPagingSize]=\"localPagingSize\"\n                                 [notifierService]=\"notifierService\"\n                                 (filterChange)=\"headerChange($event)\"\n                                 (columnChange)=\"updateCurrentColumns($event)\"\n        ></shark-table-info-header>\n        <table>\n            <caption [ngClass]=\"{'screen-reader': hideCaption}\">{{ caption }}</caption>\n            <thead shark-table-header\n                   [sortable]=\"sortable\"\n                   [columns]=\"currentColumns\"\n                   [columnOrdering]=\"columnOrdering\"\n                   [childRows]=\"childRows\"\n                   [page]=\"page\"\n                   [filterable]=\"filterable\"\n                   [columnFiltering]=\"columnFiltering\"\n                   [localPagingSize]=\"localPagingSize\"\n                   [filter]=\"filter\"\n                   [showFilterPlaceholders]=\"showFilterPlaceholders\"\n                   [notifierService]=\"notifierService\"\n                   (sortChange)=\"changeSort($event.property, $event.sortType)\"\n                   (filterChange)=\"headerChange($event)\"\n                   (columnChange)=\"updateCurrentColumns($event)\"\n            ></thead>\n            <tbody shark-table-body\n                   [currentColumns]=\"currentColumns\"\n                   [columns]=\"columns\"\n                   [localFilter]=\"localFilter\"\n                   [localPaging]=\"localPaging\"\n                   [columnFiltering]=\"columnFiltering\"\n                   [filter]=\"filter\"\n                   [childRows]=\"childRows\"\n                   [childComponent]=\"childComponent\"\n                   [linkTarget]=\"linkTarget\" [linkKey]=\"linkKey\"\n                   [page]=\"page\"\n                   [tableEmptyMessage]=\"tableEmptyMessage\"\n                   [rowStylingFunction]=\"rowStylingFunction\"\n                   [cellStylingFunction]=\"cellStylingFunction\"\n            ></tbody>\n        </table>\n        <shark-table-footer *ngIf=\"footer && currentColumns.length > 0\"\n                            [page]=\"page\"\n                            [columns]=\"currentColumns\"\n                            [filter]=\"filter\"\n                            [localPaging]=\"localPaging\"\n                            [localPagingSize]=\"localPagingSize\"\n                            [localPagingOptions]=\"localPagingOptions\"\n                            [showLocalPagingOptions]=\"showLocalPagingOptions\"\n                            [notifierService]=\"notifierService\"\n                            (filterChange)=\"headerChange($event)\"\n                            (paginationChange)=\"changePage($event)\"\n        ></shark-table-footer>\n      </div>\n  "
                },] },
    ];
    /** @nocollapse */
    SharkTableComponent.ctorParameters = function () { return [
        { type: Router, },
        { type: SharkTableUtils, },
    ]; };
    SharkTableComponent.propDecorators = {
        'headerInfoComponent': [{ type: ViewChild, args: [SharkTableInfoHeaderComponent,] },],
        'headerComponent': [{ type: ViewChild, args: [SharkTableHeaderComponent,] },],
        'footerComponent': [{ type: ViewChild, args: [SharkTableFooterComponent,] },],
        'data': [{ type: Input },],
        'columns': [{ type: Input },],
        'caption': [{ type: Input },],
        'hideCaption': [{ type: Input },],
        'columnPicker': [{ type: Input },],
        'columnOrdering': [{ type: Input },],
        'linkTarget': [{ type: Input },],
        'linkKey': [{ type: Input },],
        'sortable': [{ type: Input },],
        'filterable': [{ type: Input },],
        'columnFiltering': [{ type: Input },],
        'localFilter': [{ type: Input },],
        'showFilterPlaceholders': [{ type: Input },],
        'localPaging': [{ type: Input },],
        'localPagingSize': [{ type: Input },],
        'localPagingOptions': [{ type: Input },],
        'showLocalPagingOptions': [{ type: Input },],
        'serverSideData': [{ type: Input },],
        'initialSort': [{ type: Input },],
        'rowStylingFunction': [{ type: Input },],
        'cellStylingFunction': [{ type: Input },],
        'childRows': [{ type: Input },],
        'childComponent': [{ type: Input },],
        'pageChange': [{ type: Output },],
        'filter': [{ type: Input },],
        'footer': [{ type: Input },],
        'tableEmptyMessage': [{ type: Input },],
    };
    return SharkTableComponent;
}());
export { SharkTableComponent };
//# sourceMappingURL=table.component.js.map