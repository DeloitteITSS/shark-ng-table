import { ElementRef, EventEmitter } from '@angular/core';
import { SharkColumnDropdownComponent } from './column-dropdown.component';
import { SharkColumn } from './column';
import { SharkHeaderFilterChange } from './table.header.component';
import { NotifierService } from './notifier/notifier.service';
export declare class SharkTableInfoHeaderComponent {
    columnPickerComponent: SharkColumnDropdownComponent;
    filterInput: ElementRef;
    columns: SharkColumn[];
    allColumns: SharkColumn[];
    columnPicker: boolean;
    serverSideData: boolean;
    filterable: boolean;
    columnFiltering: boolean;
    filter: string;
    showFilterPlaceholders: boolean;
    localPagingSize: number;
    notifierService: NotifierService;
    filterChange: EventEmitter<SharkHeaderFilterChange>;
    columnChange: EventEmitter<SharkColumn[]>;
    fireFilterChange(): void;
    fireColumnChange(event: SharkColumn[]): void;
}
