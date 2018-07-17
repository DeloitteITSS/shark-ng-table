import { PipeTransform } from '@angular/core';
import { SharkColumn } from './column';
import { SharkTableUtils } from './table.utils';
export declare class LocalFilterPipe implements PipeTransform {
    private tableUtils;
    constructor(tableUtils: SharkTableUtils);
    transform(items: any, cols: SharkColumn[], localFilter: boolean, localPaging: boolean, columnFiltering: boolean, filterText: string): any;
}
