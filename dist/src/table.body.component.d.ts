import { OnChanges, SimpleChanges, Type } from '@angular/core';
import { SharkColumn } from './column';
import { Router } from '@angular/router';
import { SharkTableUtils } from './table.utils';
import { SharkDynamicContents } from './dynamic/dynamic.contents';
import { Page } from './page';
/**
 * This component controls each row in the table.
 */
export declare class SharkTableBodyComponent implements OnChanges {
    private router;
    private tableUtils;
    currentColumns: SharkColumn[];
    columns: SharkColumn[];
    localFilter: boolean;
    localPaging: boolean;
    columnFiltering: boolean;
    filter: string;
    rowStylingFunction: RowStyleFunction;
    cellStylingFunction: CellStyleFunction;
    childRows: boolean;
    childComponent: Type<SharkDynamicContents>;
    linkTarget: string;
    linkKey: string;
    tableEmptyMessage: string;
    page: Page;
    openChildren: number[];
    constructor(router: Router, tableUtils: SharkTableUtils);
    ngOnChanges(changes: SimpleChanges): void;
    addStyleToCell(row: any, column: SharkColumn): {
        [key: string]: string;
    } | {};
    childOpen(index: number): boolean;
    /**
     * Toggle the show/hide status of the child row
     */
    toggleChild(index: number): void;
    /**
     * If provided, navigate to link for this row using the router.
     *
     * @param {Object} row
     */
    rowClick(row: Object): void;
}
export interface RowStyleFunction {
    /**
     * Sends in the current row data and returns an object to be
     * used in conjunction with NgStyle with the format like:
     *
     * { 'background-color': 'red' }
     */
    (row: any): {
        [key: string]: string;
    } | {};
}
export interface CellStyleFunction {
    /**
     * Sends in the current row data and returns an object to be
     * used in conjunction with NgStyle with the format like:
     *
     * { 'background-color': 'red' }
     */
    (row: any, column: SharkColumn, cell: any): {
        [key: string]: string;
    } | {};
}
