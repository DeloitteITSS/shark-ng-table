import { Directive, ViewContainerRef } from '@angular/core';
var SharkDynamicContentsDirective = (function () {
    function SharkDynamicContentsDirective(viewContainerRef) {
        this.viewContainerRef = viewContainerRef;
    }
    SharkDynamicContentsDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[sharkDynamicContents]'
                },] },
    ];
    /** @nocollapse */
    SharkDynamicContentsDirective.ctorParameters = function () { return [
        { type: ViewContainerRef, },
    ]; };
    return SharkDynamicContentsDirective;
}());
export { SharkDynamicContentsDirective };
//# sourceMappingURL=dynamic.contents.directive.js.map