import type {FilterParams, PaginationParams} from "./cursor-pagination.js";

export function parsePaginationParams(query:Record<string,any>,allowedSortBy:string[]) {

        return  {
            cursor:query.cursor,
            limit:query.limit,
            sortBy:query.sortBy,
            sortOrder:query.sortOrder ? 'asc' : 'desc',
        } as PaginationParams;
}

export function parseFilterParams(query:Record<string,any>,allowedFields:string[]) {
    const allowedOperations = new Set<string>(['eq','ne','gte','lt','lte','IN','like']);
    const filter = query.filter ;
    let filterList:Object[] = [];

    Object.entries(filter).forEach(([field, value]) => {
        if (value instanceof Object) {
            let filterParam = {
                field: field,
                op: Object.keys(value)[0] ?? "NONE",
                value: Object.values(value)[0]
            }
        console.log(filterParam)
        if(allowedOperations.has(filterParam.op) && allowedFields.includes(field)){
            filterList.push(filterParam);
        }
        }
    })
    return filterList;


    // const filterFields = Object.keys(filter).
    //                         +    filter(field => allowedFields.includes(field));
    // filterFields.map(field => {
    //     const filterOperation = filter[field];
    //
    // })
        /*
        * filter {
        *   id: {
        *       eq:7
        * }
        * */
    //
    // return Object.entries(filter).flatMap(([key, value]) => {
    //     if(!allowedFields.includes(key) ) return []
    //     const fieldFilter = filter[key] ;
    //     return Object.entries(fieldFilter).
    //     filter(([op]) => allowedOperations.has(op) )
    //         .map(([op, value]) => {
    //             return {
    //                 field: key,
    //                 op: op,
    //                 value: value
    //             } as FilterParams;
    //         })
    // })


}