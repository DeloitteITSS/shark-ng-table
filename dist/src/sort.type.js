/**
 * Enumeration of the 3 different Sort types
 */
export var SharkSortType;
(function (SharkSortType) {
    /**
     * No sorting applied, defaults to ASC.
     */
    SharkSortType[SharkSortType["NONE"] = 0] = "NONE";
    /**
     * Sort ascending (1, 2, 3)
     */
    SharkSortType[SharkSortType["ASC"] = 1] = "ASC";
    /**
     * Sort descending (3, 2, 1)
     */
    SharkSortType[SharkSortType["DESC"] = 2] = "DESC";
})(SharkSortType || (SharkSortType = {}));
/**
 * Placeholder for a column sort
 */
var SharkCurrentSort = (function () {
    function SharkCurrentSort() {
    }
    return SharkCurrentSort;
}());
export { SharkCurrentSort };
//# sourceMappingURL=sort.type.js.map