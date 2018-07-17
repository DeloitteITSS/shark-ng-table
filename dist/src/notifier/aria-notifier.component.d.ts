import { OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { NotifierService } from './notifier.service';
export declare class AriaNotifierComponent implements OnChanges, OnDestroy {
    status: string;
    notifierService: NotifierService;
    private notifierSubscription;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    private subscribeToNotifier();
}
