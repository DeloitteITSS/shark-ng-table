import { EventEmitter, OnChanges, SimpleChanges, ElementRef } from '@angular/core';
import { Page } from './page';
export declare class SharkTablePaginationComponent implements OnChanges {
    private elementRef;
    pageCount: number[];
    first: boolean;
    last: boolean;
    previous: boolean;
    next: boolean;
    displayedPages: number[];
    page: Page;
    paginationChange: EventEmitter<number>;
    private lastButton;
    constructor(elementRef: ElementRef);
    ngOnChanges(changes: SimpleChanges): void;
    changePage(pageNo: number): void;
}
