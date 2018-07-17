import { EventEmitter } from '@angular/core';
import { SharkColumn } from './column';
import { SharkSortType } from './sort.type';
export declare class SharkTableHeaderButtonComponent {
    column: SharkColumn;
    sortChange: EventEmitter<SharkSortChangeEvent>;
    ariaButtonLabel: string;
    changeSort(): void;
}
export interface SharkSortChangeEvent {
    property: string;
    sortType: SharkSortType;
}
