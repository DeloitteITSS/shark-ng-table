/**
 * Enumeration of the 3 different Sort types
 */
export declare enum SharkSortType {
    /**
     * No sorting applied, defaults to ASC.
     */
    NONE = 0,
    /**
     * Sort ascending (1, 2, 3)
     */
    ASC = 1,
    /**
     * Sort descending (3, 2, 1)
     */
    DESC = 2,
}
/**
 * Placeholder for a column sort
 */
export declare class SharkCurrentSort {
    /**
     * Column property
     */
    property: string;
    /**
     * Sort type
     */
    sortType: SharkSortType;
}
