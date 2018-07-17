import { Injectable } from '@angular/core';
var SharkTableUtils = (function () {
    function SharkTableUtils() {
    }
    SharkTableUtils.prototype.exportRow = function (row, columns, rendered) {
        var _this = this;
        var newRow = {};
        Object.keys(row).forEach(function (key) {
            var col = columns.filter(function (col) { return col.displayed; }).find(function (col) { return col.property === key; });
            if (col) {
                newRow[key] = _this.retrieveCell(row, col, rendered);
            }
        });
        return newRow;
    };
    SharkTableUtils.prototype.retrieveCell = function (row, column, rendered) {
        if (rendered === void 0) { rendered = true; }
        var cell = this.findValue(row, column.property);
        if (column.pipe && rendered) {
            return this.applyPipe(column.pipe, cell, column.pipeArgs, column.pipeConstructorArgs);
        }
        return cell;
    };
    SharkTableUtils.prototype.applyPipe = function (pipe, cell, pipeArgs, pipeConstructorArgs) {
        var pipeInstance = new (pipe.bind.apply(pipe, [void 0].concat(pipeConstructorArgs)))();
        return pipeInstance.transform.apply(pipeInstance, [cell].concat(pipeArgs));
    };
    SharkTableUtils.prototype.filter = function (items, cols, columnFiltering, filterText) {
        var _this = this;
        return items.filter(function (row) {
            var found = false;
            if (columnFiltering && _this.hasFilter(cols)) {
                var rowFound = false;
                // Not using forEach here because we needed to break when a false match occurs during column filtering
                for (var _i = 0, cols_1 = cols; _i < cols_1.length; _i++) {
                    var col = cols_1[_i];
                    var value = _this.retrieveCell(row, col) + '';
                    var search = col.filter ? col.filter : '';
                    if (search.length > 0) {
                        if (value && (value.toLowerCase().indexOf(search.toLowerCase()) !== -1)) {
                            rowFound = true;
                        }
                        else {
                            rowFound = false;
                            break;
                        }
                    }
                }
                found = rowFound;
            }
            else if (columnFiltering && !_this.hasFilter(cols)) {
                return true;
            }
            else if (filterText) {
                cols.forEach(function (col) {
                    var value = _this.retrieveCell(row, col) + '';
                    if (filterText && value && (value.toLowerCase().indexOf(filterText.toLowerCase()) !== -1)) {
                        found = true;
                    }
                });
            }
            return found;
        });
    };
    SharkTableUtils.prototype.findValue = function (input, key) {
        var arr = key.split('.');
        while (arr.length && (input = input[arr.shift()])) { }
        ;
        return input;
    };
    SharkTableUtils.prototype.hasFilter = function (cols) {
        return cols.filter(function (col) { return col.filter && col.filter.length > 0; }).length > 0;
    };
    SharkTableUtils.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    SharkTableUtils.ctorParameters = function () { return []; };
    return SharkTableUtils;
}());
export { SharkTableUtils };
//# sourceMappingURL=table.utils.js.map