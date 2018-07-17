import { Subject } from 'rxjs/Subject';
var NotifierService = (function () {
    function NotifierService() {
        this.messageSubject = new Subject();
        this.messageObservable = this.messageSubject.asObservable();
    }
    NotifierService.prototype.postMessage = function (message) {
        this.messageSubject.next(message);
    };
    return NotifierService;
}());
export { NotifierService };
//# sourceMappingURL=notifier.service.js.map