import { AfterViewInit, ChangeDetectorRef, ComponentFactoryResolver } from '@angular/core';
import { SharkColumn } from './column';
import { SharkTableUtils } from './table.utils';
import { SharkDynamicContentsDirective } from './dynamic/dynamic.contents.directive';
export declare class SharkTableCellComponent implements AfterViewInit {
    private tableUtils;
    private componentFactoryResolver;
    private cdr;
    column: SharkColumn;
    row: any;
    tableCellContentsDirective: SharkDynamicContentsDirective;
    noComponentContents: any;
    constructor(tableUtils: SharkTableUtils, componentFactoryResolver: ComponentFactoryResolver, cdr: ChangeDetectorRef);
    ngAfterViewInit(): void;
    private retrieveCell(row, column);
    private loadComponent();
}
