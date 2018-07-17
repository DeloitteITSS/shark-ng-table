import { Observable } from 'rxjs/Observable';
export declare class NotifierService {
    messageObservable: Observable<string>;
    private messageSubject;
    constructor();
    postMessage(message: string): void;
}
