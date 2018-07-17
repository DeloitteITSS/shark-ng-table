import { Pipe } from '@angular/core';
import { SharkTableUtils } from './table.utils';
var LocalFilterPipe = (function () {
    function LocalFilterPipe(tableUtils) {
        this.tableUtils = tableUtils;
    }
    LocalFilterPipe.prototype.transform = function (items, cols, localFilter, localPaging, columnFiltering, filterText) {
        if (localFilter && (columnFiltering && this.tableUtils.hasFilter(cols) || (filterText && filterText.length > 0))) {
            return this.tableUtils.filter(items, cols, columnFiltering, filterText);
        }
        return items;
    };
    LocalFilterPipe.decorators = [
        { type: Pipe, args: [{
                    name: 'localfilter'
                },] },
    ];
    /** @nocollapse */
    LocalFilterPipe.ctorParameters = function () { return [
        { type: SharkTableUtils, },
    ]; };
    return LocalFilterPipe;
}());
export { LocalFilterPipe };
//# sourceMappingURL=localfilter.pipe.js.map