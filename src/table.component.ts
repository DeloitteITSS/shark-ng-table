import {
  Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, Type,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Page, Sort } from './page';
import { SharkColumn } from './column';
import { SharkPageChangeEvent } from './page.change.event';
import { SharkCurrentSort, SharkSortType } from './sort.type';
import { SharkTableUtils } from './table.utils';
import { SharkTablePaginationComponent } from './table.pagination.component';
import { SharkDynamicContents } from './dynamic/dynamic.contents';
import { SharkHeaderFilterChange, SharkTableHeaderComponent } from './table.header.component';

@Component({
  selector: 'shark-table',
  template: `
      <div class="table-wrapper">
          <table role="grid">
              <thead shark-table-header
                     [sortable]="sortable"
                     [columns]="columns"
                     [childRows]="childRows"
                     [refreshButton]="refreshButton"
                     [page]="page"
                     [filterable]="filterable"
                     [columnFiltering]="columnFiltering"
                     [localPaging]="localPaging"
                     [localPagingSize]="localPagingSize"
                     [localPagingOptions]="localPagingOptions"
                     [showLocalPagingOptions]="showLocalPagingOptions"
                     [filter]="filter"
                     (sortChange)="changeSort($event.property, $event.sortType)"
                     (filterChange)="headerChange($event)"
              ></thead>
              <ng-container *ngIf="page.content">
                  <tbody shark-table-row *ngFor="let row of (page.content | localfilter:columns:localFilter:localPaging:columnFiltering:filter); let e = even; let o = odd"
                         [columns]="columns"
                         [childRows]="childRows"
                         [childComponent]="childComponent"
                         [linkTarget]="linkTarget" [linkKey]="linkKey"
                         [row]="row" [odd]="o" [even]="e"
                  ></tbody>
              </ng-container>
              <ng-container *ngIf="!page.content || page.content.length == 0">
                  <tbody>
                    <tr><td [attr.colspan]="columns.length">This table contains no rows</td></tr>
                  </tbody>
              </ng-container>
              <tfoot shark-table-footer *ngIf="footer" [page]="page" [columns]="columns" [filter]="filter" [childRows]="childRows"></tfoot>
              <tfoot shark-table-header #sharkTableHeaderFooter *ngIf="footer && headersInFooter"
                     [sortable]="sortable"
                     [columns]="columns"
                     [childRows]="childRows"
                     [refreshButton]="refreshButton"
                     [page]="page"
                     [filterable]="filterable"
                     [columnFiltering]="columnFiltering && footerColumnFiltering"
                     [footer]="true"
                     (sortChange)="changeSort($event.property, $event.sortType)"
                     (filterChange)="headerChange($event)"
              ></tfoot>
          </table>
          <shark-table-pagination [page]="page" (paginationChange)="changePage($event)"></shark-table-pagination>
      </div>
  `
})
export class SharkTableComponent implements OnInit, OnChanges, OnDestroy {

  @ViewChild(SharkTableHeaderComponent)
  headerComponent: SharkTableHeaderComponent;

  @ViewChild(SharkTablePaginationComponent)
  paginationComponent: SharkTablePaginationComponent;

  /**
   * The raw table data
   */
  @Input()
  data: Page | Observable<Page | any[]> | any[];

  /**
   * The table column definitions
   */
  @Input()
  columns: SharkColumn[];

  /**
   * The destination page for the call to `router.navigate` when the row is clicked.
   */
  @Input()
  linkTarget: string;

  /**
   * The property name from the data object to pass to `router.navigate` when the rows is clicked.
   */
  @Input()
  linkKey: string;

  /**
   * Enables the sorting headers
   * @type {boolean}
   */
  @Input()
  sortable = true;

  /**
   * Enables the global filter text box
   * @type {boolean}
   */
  @Input()
  filterable = true;

  /**
   * Enables column specific filter boxes
   * @type {boolean}
   */
  @Input()
  columnFiltering = false;

  /**
   * Enables client-side filtering as opposed to just emitting a `SharkPageChangeEvent`
   * @type {boolean}
   */
  @Input()
  localFilter = true;

  /**
   * Enables client-side pagination as opposed to just emitting a `SharkPageChangeEvent`
   * @type {boolean}
   */
  @Input()
  localPaging = true;

  /**
   * The size of each page
   * @type {number}
   */
  @Input()
  localPagingSize: number = 10;

  /**
   * The supported page sizes
   * @type {number[]}
   */
  @Input()
  localPagingOptions: number[] = [ 10, 20, 100 ];

  /**
   * Enables the drop down for changing the page size
   * @type {boolean}
   */
  @Input()
  showLocalPagingOptions = true;

  /**
   * Shows a button that when clicked, emits a `SharkPageChangeEvent`
   * @type {boolean}
   */
  @Input()
  refreshButton = false;

  /**
   * The initial sortString
   */
  @Input()
  initialSort: string;

  /**
   * Enables children rows
   * @type {boolean}
   */
  @Input()
  childRows = false;

  /**
   * Your custom component which extends {@link SharkDynamicContents} that will be used
   * to render each child row. Your custom component needs to be registered in your NgModule
   * as an `entryComponent` and in the `declarations` section.
   *
   * The easiest way to specify this component in your HTML template is to create an instance variable
   * and assign it, eg:
   *
   * ```typescript
   * @Component({
   *    template: `
   *      <shark-table
   *          [data]="testData"
   *          [columns]="tableColumns"
   *          [childRows]="true"
   *          [childComponent]="childComponent"
   *      >
   *      </shark-table>
   *    `
   * })
   * export class MyComponent {
   *    childComponent = MyChildComponent
   * }
   *
   * ```
   */
  @Input()
  childComponent?: Type<SharkDynamicContents>;

  /**
   * {@link SharkPageChangeEvent} events are emitted from here
   * @type {EventEmitter<SharkPageChangeEvent>}
   */
  @Output()
  pageChange = new EventEmitter<SharkPageChangeEvent>();

  /**
   * The current filter value
   */
  @Input()
  filter: string;

  /**
   * Show the footer with 'Showing x through y of z rows`
   *
   * @type {boolean}
   */
  @Input()
  footer = true;

  /**
   * Repeat the headers in the footer
   *
   * @type {boolean}
   */
  @Input()
  headersInFooter = false;

  /**
   * Show the columnFiltering elements in the footer
   *
   * @type {boolean}
   */
  @Input()
  footerColumnFiltering = false;

  page: Page;

  private dataSubscription: Subscription;

  private localSubscription: Subscription;

  constructor(private router: Router, private tableUtils: SharkTableUtils) {}

  ngOnInit(): void {
    this.updatePage();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const dataChange = changes['data'];
    const columnChange = changes['columns'];

    if (dataChange && !dataChange.isFirstChange()) {
      this.updatePage();
    } else if (columnChange && !columnChange.isFirstChange()) {
        this.emitCurrent();
    }
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }

    if (this.localSubscription) {
      this.localSubscription.unsubscribe();
    }
  }

  /**
   * Emits a {@link SharkPageChangeEvent} with the current information. This event should be consumed by the host
   * component and sent to a REST endpoint to update the data.
   */
  emitCurrent(): void {
    this.pageChange.emit({
      pageNo: this.page.number,
      columns: this.columns,
      sortString: this.generateSortString(),
      sorts: this.generateSortArray(),
      filter: this.filter
    });
  }

  headerChange(event: SharkHeaderFilterChange): void {
    this.columns = event.columns;
    this.filter = event.filter;
    this.localPagingSize = event.localPagingSize;

    this.emitCurrent();
  }

  changePage(pageNo: number): void {
    this.pageChange.emit({
      pageNo: pageNo,
      columns: this.columns,
      sortString: this.generateSortString(),
      sorts: this.generateSortArray(),
      filter: this.filter
    });
  }

  changeSort(columnProperty: string, sortType: SharkSortType): void {
    if (this.sortable) {
      this.columns.forEach((column: SharkColumn) => {

        if (column.property === columnProperty) {
          // State Machine
          // ASC -> DESC -> NONE -> ASC
          switch (sortType) {
            case SharkSortType.ASC: {
              // -> DESC
              column.sortType = SharkSortType.DESC;
              break;
            }
            case SharkSortType.DESC: {
              // -> NONE
              column.sortType = SharkSortType.NONE;
              break;
            }
            case SharkSortType.NONE:
            default: {
              // -> ASC
              column.sortType = SharkSortType.ASC;
              break;
            }
          }
        }
      });

      const sorts = this.generateSortArray();

      if (!this.refreshButton) {
        // sort internally
        this.sort(this.page.content, sorts);
      }

      this.pageChange.emit({
        pageNo: this.page.number,
        columns: this.columns,
        sortString: this.generateSortString(),
        sorts: sorts,
        filter: this.filter
      });
    }
  }

  private generateSortString(): string {
    let sortString = '';

    this.columns.forEach((column: SharkColumn) => {
      switch (column.sortType) {
        case SharkSortType.ASC: {
          sortString += '' + column.property + ';';
          break;
        }
        case SharkSortType.DESC: {
          sortString += '-' + column.property + ';';
          break;
        }
        case SharkSortType.NONE: {
          break;
        }
      }
    });

    return sortString;
  }

  private generateSortArray(): SharkCurrentSort[] {
    const currentSorts: SharkCurrentSort[] = [];

    this.columns.forEach((column: SharkColumn) => {
      switch (column.sortType) {
        case SharkSortType.ASC:
        case SharkSortType.DESC: {
          currentSorts.push({property: column.property, sortType: column.sortType});
          break;
        }
      }
    });

    return currentSorts;
  }

  private sort(content: any[], sorts: SharkCurrentSort[]): void {
    content.sort((a, b) => {
      let result = 0;

      sorts.forEach((sort: SharkCurrentSort) => {
        if ( result === 0 ) {
          const aVal = this.tableUtils.findValue(a, sort.property);
          const bVal = this.tableUtils.findValue(b, sort.property);

          if (!isNaN(Number(aVal)) && !isNaN(Number(bVal))) {
            result = aVal - bVal;
          } else {
            result = (aVal < bVal) ? -1 : (aVal > bVal) ? 1 : 0;
          }

          result *= (sort.sortType === SharkSortType.DESC) ? -1 : 1;
        }
      });

      return result;
    });
  }

  private updatePage(): void {
    if (this.data) {

      if (this.data.constructor === Array) {
        this.setupPageArray();
      } else if (this.data.constructor === Observable) {
        this.setupPageSubscription();
      } else {
        this.page = this.data as Page;

        if (!this.page.number) {
          this.page.number = 0;
        }
      }

      this.setupInitialSort();
    }
  }

  private setupPageArray(): void {
    if (this.localPaging) {
        const total = (this.data as any[]).length;
        const pageCount = Math.ceil(total / this.localPagingSize);

        this.page = {
          number: 0,
          totalPages: pageCount,
          totalElements: total,
          first: true,
          last: false,
          numberOfElements: this.localPagingSize,
          content: (this.data as any[]).slice(0, this.localPagingSize)
        };

        if (this.localSubscription) {
          this.localSubscription.unsubscribe();
        }

        this.localSubscription = this.pageChange.subscribe((event) => this.calculateLocalPage(event));
    } else if (this.localFilter) {
      const total = (this.data as any[]).length;

      this.page = {
        number: 0,
        totalPages: 1,
        totalElements: total,
        first: true,
        last: false,
        numberOfElements: total,
        content: this.data as any[]
      };

      if (this.localSubscription) {
        this.localSubscription.unsubscribe();
      }

      this.localSubscription = this.pageChange.subscribe((event) => this.calculateLocalPageNoPagination(event));
    } else {
      this.page = {content: this.data as any[]};
    }
  }

  private calculateLocalPageNoPagination(event: SharkPageChangeEvent): void {
    if (((event.filter && event.filter.length > 0)) || this.tableUtils.hasFilter(event.columns)) {
      const filteredContent = this.tableUtils.filter(this.data, this.columns, this.columnFiltering, event.filter);

      this.page = {
        number: 0,
        totalPages: 1,
        totalElements: filteredContent.length,
        first: true,
        last: false,
        numberOfElements: filteredContent.length,
        content: filteredContent
      };
    } else {
      const total = (this.data as any[]).length;

      this.page = {
        number: 0,
        totalPages: 1,
        totalElements: total,
        first: true,
        last: false,
        numberOfElements: total,
        content: this.data as any[]
      };
    }
  }

  private calculateLocalPage(event: SharkPageChangeEvent): void {
      let content;

      if (this.localFilter && ((event.filter && event.filter.length > 0)) || this.tableUtils.hasFilter(event.columns)) {
        content = this.tableUtils.filter(this.data, this.columns, this.columnFiltering, event.filter);
      } else {
        content = (this.data as any[]);
      }

      this.sort(content, this.generateSortArray());
      const total = content.length;
      // IntelliJ claims this * 1 call is useless, but we need to make sure it's a number
      const pageSize: number = (this.localPagingSize > content.length ? content.length : this.localPagingSize) * 1;
      const pageCount = Math.ceil(total / pageSize);
      const pageNo = event.pageNo > pageCount || content.length <= pageSize ? 0 : event.pageNo;
      const sliceRange = pageSize * pageNo + pageSize;
      const displayedContent = content.slice((pageSize * pageNo), sliceRange);

      this.page = {
        number: pageNo,
        totalPages: pageCount,
        totalElements: total,
        first: pageNo === 0,
        last: pageNo === pageCount,
        numberOfElements: pageSize,
        content: displayedContent
      };
  }

  private setupPageSubscription(): void {
    // Fix potential memory leak, by unsubscribing to previous subscription if exists
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }

    this.dataSubscription = (this.data as Observable<Page | any[]>).subscribe((data: Page | any[]) => {
      if (this.data.constructor === Array) {
        this.page = {content: data as any[]};
      } else {
        this.page = data as Page;
      }
    });
  }

  private setupInitialSort() {

    if (this.initialSort) {
      const sorts = this.initialSort.split(';');

      sorts.forEach((sort: string) => {
        this.columns.forEach((column: SharkColumn) => {
          let type = SharkSortType.NONE;
          let property = sort;

          if (sort.startsWith('-')) {
            type = SharkSortType.DESC;
            property = property.substr(1);
          } else {
            type = SharkSortType.ASC;
          }

          if (property === column.property) {
            column.sortType = type;
          }
        });
      });

      this.changeSort('', undefined);
    }

    if (this.page.sorts && this.page.sorts.length > 0) {
      this.columns.forEach((column: SharkColumn) => {

        this.page.sorts.forEach((sort: Sort) => {
          if (column.property === sort.property) {
            column.sortType = SharkSortType.NONE;

            if (sort.ascending) {
              column.sortType = SharkSortType.ASC;
            } else if (sort.descending) {
              column.sortType = SharkSortType.DESC;
            }
          }
        });
      });

      this.changeSort('', undefined);
    }
  }
}
