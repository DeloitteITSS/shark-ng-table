import { EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Page } from './page';
import { SharkColumn } from './column';
import { SharkTableUtils } from './table.utils';
import { SharkHeaderFilterChange } from './table.header.component';
import { SharkTablePaginationComponent } from './table.pagination.component';
import { NotifierService } from './notifier/notifier.service';
export declare class SharkTableFooterComponent implements OnChanges {
    private tableUtils;
    start: number;
    end: number;
    total: number;
    filtered: boolean;
    currentPageInfo: string;
    paginationComponent: SharkTablePaginationComponent;
    notifierService: NotifierService;
    localPaging: boolean;
    localPagingSize: number;
    localPagingOptions: number[];
    showLocalPagingOptions: boolean;
    /**
     * The current {@link Page}
     */
    page: Page;
    /**
     * The current {@link SharkColumn}[]
     */
    columns: SharkColumn[];
    /**
     * The current filter string
     */
    filter: string;
    filterChange: EventEmitter<SharkHeaderFilterChange>;
    paginationChange: EventEmitter<number>;
    constructor(tableUtils: SharkTableUtils);
    ngOnChanges(changes: SimpleChanges): void;
    firePageSizeChange(): void;
    changePage(pageNo: number): void;
}
