import { Component, Input } from '@angular/core';
var AriaNotifierComponent = (function () {
    function AriaNotifierComponent() {
    }
    AriaNotifierComponent.prototype.ngOnChanges = function (changes) {
        if (changes.hasOwnProperty('notifierService')) {
            if (!this.notifierSubscription) {
                this.subscribeToNotifier();
            }
            else {
                this.notifierSubscription.unsubscribe();
                this.subscribeToNotifier();
            }
        }
    };
    AriaNotifierComponent.prototype.ngOnDestroy = function () {
        if (this.notifierSubscription) {
            this.notifierSubscription.unsubscribe();
        }
    };
    AriaNotifierComponent.prototype.subscribeToNotifier = function () {
        var _this = this;
        this.notifierSubscription = this.notifierService.messageObservable.subscribe(function (message) {
            _this.status = message;
            setTimeout(function () { return _this.status = ''; }, 1000);
        });
    };
    AriaNotifierComponent.decorators = [
        { type: Component, args: [{
                    selector: 'shark-table-aria-notifier',
                    template: "<div class=\"notification-area screen-reader\" aria-atomic=\"true\" aria-live=\"polite\">{{ status }}</div>"
                },] },
    ];
    /** @nocollapse */
    AriaNotifierComponent.ctorParameters = function () { return []; };
    AriaNotifierComponent.propDecorators = {
        'notifierService': [{ type: Input },],
    };
    return AriaNotifierComponent;
}());
export { AriaNotifierComponent };
//# sourceMappingURL=aria-notifier.component.js.map