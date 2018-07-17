import { SharkColumn } from './column';
import { PipeTransform, Type } from '@angular/core';
export declare class SharkTableUtils {
    exportRow(row: Object, columns: SharkColumn[], rendered: boolean): Object;
    retrieveCell(row: Object, column: SharkColumn, rendered?: boolean): string;
    applyPipe(pipe: Type<PipeTransform>, cell: any, pipeArgs: any[], pipeConstructorArgs: any[]): string;
    filter(items: any, cols: SharkColumn[], columnFiltering: boolean, filterText: string): any;
    findValue(input: Object, key: string): any;
    hasFilter(cols: SharkColumn[]): boolean;
}
