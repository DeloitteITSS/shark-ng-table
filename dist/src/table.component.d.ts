import { EventEmitter, OnChanges, OnDestroy, OnInit, SimpleChanges, Type } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Page } from './page';
import { SharkColumn } from './column';
import { SharkPageChangeEvent } from './page.change.event';
import { SharkSortType } from './sort.type';
import { SharkTableUtils } from './table.utils';
import { SharkDynamicContents } from './dynamic/dynamic.contents';
import { SharkHeaderFilterChange, SharkTableHeaderComponent } from './table.header.component';
import { CellStyleFunction, RowStyleFunction } from './table.body.component';
import { SharkTableFooterComponent } from './table.footer.component';
import { SharkTableInfoHeaderComponent } from './table.info.header.component';
import { NotifierService } from './notifier/notifier.service';
import { SharkTableCurrentDataEvent } from './current.data.event';
export declare class SharkTableComponent implements OnInit, OnChanges, OnDestroy {
    private router;
    private tableUtils;
    headerInfoComponent: SharkTableInfoHeaderComponent;
    headerComponent: SharkTableHeaderComponent;
    footerComponent: SharkTableFooterComponent;
    notifierService: NotifierService;
    /**
     * The raw table data
     */
    data: Page | Observable<Page | any[]> | any[];
    /**
     * The table column definitions
     */
    columns: SharkColumn[];
    currentColumns: SharkColumn[];
    /**
     * The <caption> text for this table
     * @type {string}
     */
    caption: string;
    /**
     * Whether or not the table <caption> should be hidden (screen-reader) only.
     * @type {boolean}
     */
    hideCaption: boolean;
    /**
     * Allow users to turn columns on and off
     * @type {boolean}
     */
    columnPicker: boolean;
    /**
     * Allow users to reorder columns with header buttons
     * @type {boolean}
     */
    columnOrdering: boolean;
    /**
     * The destination page for the call to `router.navigate` when the row is clicked.
     */
    linkTarget: string;
    /**
     * The property name from the data object to pass to `router.navigate` when the rows is clicked.
     */
    linkKey: string;
    /**
     * Enables the sorting headers
     * @type {boolean}
     */
    sortable: boolean;
    /**
     * Enables the global filter text box
     * @type {boolean}
     */
    filterable: boolean;
    /**
     * Enables column specific filter boxes
     * @type {boolean}
     */
    columnFiltering: boolean;
    /**
     * Enables client-side filtering as opposed to just emitting a `SharkPageChangeEvent`
     * @type {boolean}
     */
    localFilter: boolean;
    /**
     * Enables the placeholder text for the filter boxes
     * @type {boolean}
     */
    showFilterPlaceholders: boolean;
    /**
     * Enables client-side pagination as opposed to just emitting a `SharkPageChangeEvent`
     * @type {boolean}
     */
    localPaging: boolean;
    /**
     * The size of each page
     * @type {number}
     */
    localPagingSize: number;
    /**
     * The supported page sizes
     * @type {number[]}
     */
    localPagingOptions: number[];
    /**
     * Enables the drop down for changing the page size
     * @type {boolean}
     */
    showLocalPagingOptions: boolean;
    /**
     * Shows a button that when clicked, emits a `SharkPageChangeEvent`
     * @type {boolean}
     */
    serverSideData: boolean;
    /**
     * The initial sortString
     */
    initialSort: string;
    rowStylingFunction: RowStyleFunction;
    cellStylingFunction: CellStyleFunction;
    /**
     * Enables children rows
     * @type {boolean}
     */
    childRows: boolean;
    /**
     * Your custom component which extends {@link SharkDynamicContents} that will be used
     * to render each child row. Your custom component needs to be registered in your NgModule
     * as an `entryComponent` and in the `declarations` section.
     *
     * The easiest way to specify this component in your HTML template is to create an instance variable
     * and assign it, eg:
     *
     * ```typescript
     * @Component({
     *    template: `
     *      <shark-table
     *          [data]="testData"
     *          [columns]="tableColumns"
     *          [childRows]="true"
     *          [childComponent]="childComponent"
     *      >
     *      </shark-table>
     *    `
     * })
     * export class MyComponent {
     *    childComponent = MyChildComponent
     * }
     *
     * ```
     */
    childComponent?: Type<SharkDynamicContents>;
    /**
     * {@link SharkPageChangeEvent} events are emitted from here
     * @type {EventEmitter<SharkPageChangeEvent>}
     */
    pageChange: EventEmitter<SharkPageChangeEvent>;
    /**
     * The current filter value
     */
    filter: string;
    /**
     * Show the footer with 'Showing x through y of z rows`
     *
     * @type {boolean}
     */
    footer: boolean;
    /**
     * Message to show when the table is empty
     */
    tableEmptyMessage: string;
    page: Page;
    private dataSubscription;
    private localSubscription;
    constructor(router: Router, tableUtils: SharkTableUtils);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    updateCurrentColumns(newColumns: SharkColumn[]): void;
    /**
     * Emits a {@link SharkPageChangeEvent} with the current information. This event should be consumed by the host
     * component and sent to a REST endpoint to update the data.
     */
    emitCurrent(): void;
    headerChange(event: SharkHeaderFilterChange): void;
    changePage(pageNo: number): void;
    changeSort(columnProperty: string, sortType: SharkSortType): void;
    /**
     * Currently only works if your input is an any[], returns the current "view" into the table with filtering/column selection
     * @param {boolean} rendered If you would like inline pipes to be applied to the exported data
     *
     * @returns {SharkTableCurrentDataEvent}
     */
    exportCurrentData(rendered?: boolean): SharkTableCurrentDataEvent;
    private generateSortString();
    private generateSortArray();
    private sort(content, sorts);
    private updatePage();
    private createLocalPage(data?);
    private setupPageArray();
    private calculateLocalPageNoPagination(event);
    private calculateLocalPage(event);
    private setupPageSubscription();
    private setupInitialSort();
}
