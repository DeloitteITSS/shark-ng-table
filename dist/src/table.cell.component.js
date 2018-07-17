import { ChangeDetectorRef, Component, ComponentFactoryResolver, Input, ViewChild } from '@angular/core';
import { SharkTableUtils } from './table.utils';
import { SharkDynamicContentsDirective } from './dynamic/dynamic.contents.directive';
var SharkTableCellComponent = (function () {
    function SharkTableCellComponent(tableUtils, componentFactoryResolver, cdr) {
        this.tableUtils = tableUtils;
        this.componentFactoryResolver = componentFactoryResolver;
        this.cdr = cdr;
    }
    SharkTableCellComponent.prototype.ngAfterViewInit = function () {
        this.loadComponent();
    };
    SharkTableCellComponent.prototype.retrieveCell = function (row, column) {
        return this.tableUtils.retrieveCell(row, column);
    };
    SharkTableCellComponent.prototype.loadComponent = function () {
        if (this.column.component) {
            var contents = this.retrieveCell(this.row, this.column);
            var componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.column.component);
            var viewContainerRef = this.tableCellContentsDirective.viewContainerRef;
            viewContainerRef.clear();
            var componentRef = viewContainerRef.createComponent(componentFactory);
            componentRef.instance.data = contents;
            componentRef.instance.row = this.row;
        }
        else {
            this.noComponentContents = this.retrieveCell(this.row, this.column);
        }
        // without this, everything went boom
        this.cdr.detectChanges();
    };
    SharkTableCellComponent.decorators = [
        { type: Component, args: [{
                    selector: 'shark-table-cell',
                    template: "\n      <ng-container *ngIf=\"column.component\">\n          <ng-template sharkDynamicContents></ng-template>\n      </ng-container>\n\n      <ng-container *ngIf=\"noComponentContents\">\n          {{ noComponentContents }}\n      </ng-container>\n  "
                },] },
    ];
    /** @nocollapse */
    SharkTableCellComponent.ctorParameters = function () { return [
        { type: SharkTableUtils, },
        { type: ComponentFactoryResolver, },
        { type: ChangeDetectorRef, },
    ]; };
    SharkTableCellComponent.propDecorators = {
        'column': [{ type: Input },],
        'row': [{ type: Input },],
        'tableCellContentsDirective': [{ type: ViewChild, args: [SharkDynamicContentsDirective,] },],
    };
    return SharkTableCellComponent;
}());
export { SharkTableCellComponent };
//# sourceMappingURL=table.cell.component.js.map