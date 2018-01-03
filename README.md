[![Build Status](https://travis-ci.org/Quantas/shark-ng-table.svg?branch=master)](https://travis-ci.org/Quantas/shark-ng-table)
[![CircleCI](https://circleci.com/gh/Quantas/shark-ng-table.svg?style=shield)](https://circleci.com/gh/Quantas/shark-ng-table)
[![Dependency Status][david-badge]][david-badge-url]
[![codecov](https://codecov.io/gh/Quantas/shark-ng-table/branch/master/graph/badge.svg)](https://codecov.io/gh/Quantas/shark-ng-table)

[![npm version](https://badge.fury.io/js/shark-ng-table.svg)][npm-badge-url]
[![npm](https://img.shields.io/npm/l/shark-ng-table.svg)][npm-badge-url]
[![npm](https://img.shields.io/npm/dm/shark-ng-table.svg)][npm-badge-url]

# shark-ng-table

A Table for Angular that supports filtering/sorting/pagination

## Demo

We have a running example over on [Plunker](https://embed.plnkr.co/Xus5zm/)

## Installing

```bash
npm install --save shark-ng-table
```

This will install the latest version of `shark-ng-table`.

## Import our NgModule

Add `SharkTableModule` to your module's `import` section as below:

```typescript
import {NgModule} from '@angular/core';
import {SharkTableModule} from 'shark-ng-table';


@NgModule({
  imports: [
    SharkTableModule,
  ]
})
export class MyAngularModule {}
```

## Setup Some Data

In your Component add a `SharkColumn` definition and some test data:

```typescript
import { Component } from '@angular/core';

import { SharkColumn } from 'shark-ng-table';

@Component({
  templateUrl: './tabletest.component.html',
  styleUrls: ['./tabletest.component.css']
})
export class TableTestComponent {

  testData = [
    {col1: '1', col2: 'b', col3: 'c' },
    {col1: '2', col2: 'b', col3: 'c' },
    {col1: '3', col2: 'b', col3: 'c' },
    {col1: '4', col2: 'b', col3: 'c' },
    {col1: '5', col2: 'b', col3: 'c' },
    {col1: '6', col2: 'b', col3: 'c' },
    {col1: '7', col2: 'b', col3: 'c' },
    {col1: '8', col2: 'b', col3: 'c' },
    {col1: '9', col2: 'b', col3: 'c' },
    {col1: '10', col2: 'b', col3: 'c' }
  ];

  tableColumns: SharkColumn[] = [
    { header: 'Col 1', property: 'col1'},
    { header: 'Col 2', property: 'col2'},
    { header: 'Col 3', property: 'col3'}
  ];
}
```

Then in your HTML for your component add the following:

```html
<shark-table
  [data]="testData"
  [localFilter]="true"
  [columns]="tableColumns"
  [localPaging]="true"
  [localPagingSize]="50"
>
</shark-table>
```

This will create the table with the `tableColumns` definitions and the `testData` as the source.

## shark-table options

* data - `any[]` or `Observable<Page>` or `Observable<any[]>`
    * The raw table data
* columns - `SharkColumn[]`
    * The table column definitions
* linkTarget - `string`
    * The destination page for the call to `router.navigate` when the row is clicked.
* linkKey - `string`
    * The property name from the data object to pass to `router.navigate` when the rows is clicked.
* sortable - `boolean`
    * Enables the sorting headers
* filterable - `boolean`
    * Enables the global filter text box
* localFilter - `boolean`
    * Enables client-side filtering as opposed to just emitting a `SharkPageChangeEvent`
* localPaging - `boolean`
    * Enables client-side pagination as opposed to just emitting a `SharkPageChangeEvent`
* localPagingSize - `Number`
    * The size of each page
* refreshButton - `boolean`
    * Shows a button that when clicked, emits a `SharkPageChangeEvent`
* initialSort - `string`
    * The initial sortString
* pageChange - `EventEmitter<SharkPageChangeEvent>`
    * `SharkPageChangeEvent` events are emitted from here
* filter - `string`
    * The current filter value
* childRows - `boolean`
    * Enables children rows
* childComponent - `Type<SharkChildContents>`
    * Your custom component which extends `SharkChildContents` that will be used to render each child row. Your custom component needs to be registered in your NgModule as an `entryComponent` and in the `declarations` section.

## Column Definition Syntax

## Child Row Setup and Usage

Child rows are rendered with a user-provided custom Component that implements `SharkChildContents`. An example of a custom component could be as simple as:

```typescript
import { Component } from '@angular/core';
import { SharkChildContents } from '../table';

@Component({
  template: `
    <table>
      <tr>
        <td>{{ data.col1 }}</td>
        <td>{{ data.col2 }}</td>
        <td>{{ data.col3 }}</td>
      </tr>
    </table>
  `
})
export class ChildDataComponent implements SharkChildContents {
  data: any;
}
```

This example would render your entire row as a table inside the child row.

To enable child rows, you will need to set 2 properties to your `<shark-table>` declaration, `childRows` and `childComponent`. To set `childComponent` we need to add an instance variable to the Component that is rendering this template:

```typescript

import { MyChildComponent } from './child.component';

@Component({
   template: `
     <shark-table
         [data]="testData"
         [columns]="tableColumns"
         [childRows]="true"
         [childComponent]="childComponent"
     >
     </shark-table>
   `
})
export class MyComponent {
   childComponent = MyChildComponent
}
```

## TODO - More Documentation!

[david-badge]: https://david-dm.org/quantas/shark-ng-table.svg
[david-badge-url]: https://david-dm.org/quantas/shark-ng-table
[npm-badge-url]: https://www.npmjs.com/package/shark-ng-table