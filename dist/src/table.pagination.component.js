import { Component, Input, Output, EventEmitter, ElementRef } from '@angular/core';
var SharkTablePaginationComponent = (function () {
    function SharkTablePaginationComponent(elementRef) {
        this.elementRef = elementRef;
        this.pageCount = [];
        this.first = false;
        this.last = false;
        this.previous = false;
        this.next = false;
        this.displayedPages = [];
        this.paginationChange = new EventEmitter();
    }
    SharkTablePaginationComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        if (changes.hasOwnProperty('page') && this.page) {
            this.pageCount = Array.from(Array(this.page.totalPages), function (x, i) { return i; });
            this.first = this.page.number === 0;
            this.last = this.page.number === this.pageCount.length - 1;
            this.previous = !this.first;
            this.next = !this.last;
            if (this.pageCount.length > 3) {
                if (this.first) {
                    this.displayedPages = [0, 1, 2];
                }
                else if (this.last) {
                    this.displayedPages = [this.page.number - 2, this.page.number - 1, this.page.number];
                }
                else {
                    this.displayedPages = [this.page.number - 1, this.page.number, this.page.number + 1];
                }
            }
            else {
                this.displayedPages = this.pageCount;
            }
            // fix focus when a button disappears
            if (this.lastButton) {
                setTimeout(function () {
                    if (!_this.elementRef.nativeElement.ownerDocument.getElementById(_this.lastButton)) {
                        var activeButton = _this.elementRef.nativeElement.ownerDocument.getElementById('active-button');
                        if (activeButton) {
                            activeButton.focus();
                        }
                    }
                    _this.lastButton = undefined;
                }, 100);
            }
        }
    };
    SharkTablePaginationComponent.prototype.changePage = function (pageNo) {
        this.lastButton = this.elementRef.nativeElement.ownerDocument.activeElement.id;
        this.paginationChange.emit(pageNo);
    };
    SharkTablePaginationComponent.decorators = [
        { type: Component, args: [{
                    selector: 'shark-table-pagination',
                    template: "\n      <div class=\"pagination-wrapper\" *ngIf=\"pageCount.length > 1\">\n          <div class=\"pagination\">\n              <button id=\"first-page-button\" *ngIf=\"!first\" (click)=\"changePage(0)\" type=\"button\" class=\"fa fa-angle-double-left\">\n                <span class=\"screen-reader-button-label\">First Page</span>\n              </button>\n              <button id=\"previous-page-button\" *ngIf=\"previous\" (click)=\"changePage(page.number - 1)\" type=\"button\" class=\"fa fa-angle-left\">\n                <span class=\"screen-reader-button-label\">Previous Page</span>\n              </button>\n            \n              <ng-container *ngFor=\"let num of displayedPages\">\n                <button \n                  [attr.id]=\"num === page.number ? 'active-button' : null\"\n                  [ngClass]=\"{'active': num === page.number, 'inactive': num!== page.number }\"\n                  [attr.aria-current]=\"num === page.number ? 'true' : null\"\n                  [attr.aria-disabled]=\"num === page.number ? 'true' : null\"\n                  (click)=\"changePage(num)\" type=\"button\">\n                  <span class=\"screen-reader-button-label\">Page</span>\n                  {{ num + 1 }}\n                </button>\n              </ng-container>\n            \n              <button id=\"next-page-button\" *ngIf=\"next\" (click)=\"changePage(page.number + 1)\" type=\"button\" class=\"fa fa-angle-right\">\n                <span class=\"screen-reader-button-label\">Next Page</span>\n              </button>\n              <button id=\"last-page-button\" *ngIf=\"!last\" (click)=\"changePage(pageCount.length - 1)\" type=\"button\" class=\"fa fa-angle-double-right\">\n                <span class=\"screen-reader-button-label\">Last Page</span>\n              </button>\n          </div>\n      </div>\n  "
                },] },
    ];
    /** @nocollapse */
    SharkTablePaginationComponent.ctorParameters = function () { return [
        { type: ElementRef, },
    ]; };
    SharkTablePaginationComponent.propDecorators = {
        'page': [{ type: Input },],
        'paginationChange': [{ type: Output },],
    };
    return SharkTablePaginationComponent;
}());
export { SharkTablePaginationComponent };
//# sourceMappingURL=table.pagination.component.js.map