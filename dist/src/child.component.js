import { ChangeDetectorRef, Component, ComponentFactoryResolver, Input, ViewChild } from '@angular/core';
import { SharkTableUtils } from './table.utils';
import { SharkDynamicContentsDirective } from './dynamic/dynamic.contents.directive';
/**
 * This Component is used to render your custom child row component.
 */
var SharkChildComponent = (function () {
    function SharkChildComponent(tableUtils, componentFactoryResolver, changeDetectorRef) {
        this.tableUtils = tableUtils;
        this.componentFactoryResolver = componentFactoryResolver;
        this.changeDetectorRef = changeDetectorRef;
    }
    SharkChildComponent.prototype.ngAfterViewInit = function () {
        this.loadComponent();
    };
    SharkChildComponent.prototype.ngOnChanges = function (changes) {
        if (changes.hasOwnProperty('openChildren') && !changes['openChildren'].isFirstChange()) {
            this.childOpen = changes['openChildren'].currentValue.indexOf(this.rowIndex) > -1;
            this.componentRef.instance.childOpen(this.childOpen);
        }
    };
    SharkChildComponent.prototype.loadComponent = function () {
        var componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.component);
        var viewContainerRef = this.childContentsDirective.viewContainerRef;
        viewContainerRef.clear();
        this.componentRef = viewContainerRef.createComponent(componentFactory);
        this.componentRef.instance.data = this.row;
        // without this, everything went boom
        this.changeDetectorRef.detectChanges();
    };
    SharkChildComponent.decorators = [
        { type: Component, args: [{
                    selector: 'shark-child',
                    template: "\n      <ng-template sharkDynamicContents></ng-template>\n  "
                },] },
    ];
    /** @nocollapse */
    SharkChildComponent.ctorParameters = function () { return [
        { type: SharkTableUtils, },
        { type: ComponentFactoryResolver, },
        { type: ChangeDetectorRef, },
    ]; };
    SharkChildComponent.propDecorators = {
        'component': [{ type: Input },],
        'row': [{ type: Input },],
        'rowIndex': [{ type: Input },],
        'openChildren': [{ type: Input },],
        'childContentsDirective': [{ type: ViewChild, args: [SharkDynamicContentsDirective,] },],
    };
    return SharkChildComponent;
}());
export { SharkChildComponent };
//# sourceMappingURL=child.component.js.map