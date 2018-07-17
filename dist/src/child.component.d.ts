import { AfterViewInit, ChangeDetectorRef, ComponentFactoryResolver, ComponentRef, OnChanges, SimpleChanges, Type } from '@angular/core';
import { SharkTableUtils } from './table.utils';
import { SharkDynamicContents } from './dynamic/dynamic.contents';
import { SharkDynamicContentsDirective } from './dynamic/dynamic.contents.directive';
/**
 * This Component is used to render your custom child row component.
 */
export declare class SharkChildComponent implements AfterViewInit, OnChanges {
    private tableUtils;
    private componentFactoryResolver;
    private changeDetectorRef;
    /**
     * Your custom component which extends {@link SharkDynamicContents} that will be used
     * to render each child row. Your custom component needs to be registerd in your NgModule
     * as an `entryComponent` and in the `declarations` section.
     */
    component: Type<SharkDynamicContents>;
    /**
     * The entire row, you can display anything from this row in your child component.
     */
    row: any;
    rowIndex: number;
    openChildren: number[];
    childContentsDirective: SharkDynamicContentsDirective;
    childOpen: boolean;
    componentRef: ComponentRef<SharkDynamicContents>;
    constructor(tableUtils: SharkTableUtils, componentFactoryResolver: ComponentFactoryResolver, changeDetectorRef: ChangeDetectorRef);
    ngAfterViewInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    private loadComponent();
}
