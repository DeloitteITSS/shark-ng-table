import { EventEmitter } from '@angular/core';
import { SharkColumn } from './column';
import { Page } from './page';
import { SharkSortChangeEvent } from './header-button.component';
import { NotifierService } from './notifier/notifier.service';
export declare class SharkTableHeaderComponent {
    private document;
    sortable: boolean;
    columns: SharkColumn[];
    columnOrdering: boolean;
    childRows: boolean;
    page: Page;
    filterable: boolean;
    columnFiltering: boolean;
    filter: string;
    showFilterPlaceholders: boolean;
    notifierService: NotifierService;
    localPagingSize: number;
    sortChange: EventEmitter<SharkSortChangeEvent>;
    filterChange: EventEmitter<SharkHeaderFilterChange>;
    columnChange: EventEmitter<SharkColumn[]>;
    constructor(document: any);
    dispatchSortChangeEvent(event: SharkSortChangeEvent): void;
    fireFilterChange(): void;
    moveColumnForward(index: number, column: SharkColumn): void;
    moveColumnBackward(index: number, column: SharkColumn): void;
    private focusButton(column, dir);
    private move(index, offset);
}
export interface SharkHeaderFilterChange {
    columns: SharkColumn[];
    filter: string;
    localPagingSize: number;
}
