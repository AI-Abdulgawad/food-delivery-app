import type {Knex} from "knex";
import {IsIn, IsNotEmpty, IsOptional} from 'class-validator'
export class PaginationParams {

    @IsNotEmpty()
    cursor: string= "0";
    @IsNotEmpty()
    @IsIn(['id','name','created_at'])
    sortBy: string= 'id';

    @IsOptional()
    sortOrder: 'asc' | 'desc'='asc';

    @IsOptional()
    limit: number = 5;
}


export class FilterParams {
    @IsNotEmpty()
    field!: string;

    @IsNotEmpty()
    op!:'eq'|'ne'|'gt'|'lt'|'lte'|'gte'|'IN'|'like';

    @IsNotEmpty()
    value!:string | string[];
}

export interface PaginationMeta {
    nextCursor: string;
    hasMore: boolean;
    count: number;
}

export function applyCursorPagination(query:Knex.QueryBuilder, params: PaginationParams) {
    // validation logic
    // if(!params.cursor) {
    //     throw new Error('No cursor found.');
    // }
    // if(!params.limit) {
    //     params.limit = 5;
    // }
    // if(!params.sortBy) {
    //     throw new Error('No sort by sort.');
    // }
    // if(!params.sortOrder) {
    //     params.sortOrder = 'desc';
    // }


    if (params) {
        const op = params.sortOrder === 'desc' ? '<' : '>';
        return query.where(params.sortBy,op,params.cursor)
            .orderBy(params.sortBy,params.sortOrder)
            .limit(params.limit + 1);
    }else {
     return query;
    }
}

export function applyFilters(query:Knex.QueryBuilder, params: FilterParams[]) {
    const op =  {
        eq:'=',
        ne:'<>',
        lt:'<',
        gt:'>',
        lte:'<=',
        gte:'>=',
        IN:'in',
        like:'like',
    }
    if (params) {

        for(const param of params) {
            if (param.op === 'IN') {
                query.whereIn(param.field, Array.isArray(param.value) ? param.value : [param.value])

            } else if (param.op === 'like') {
               query.whereLike(param.field, `%${param.value}%`)

            } else {
                query.where(param.field, op[param.op], param.value)
            }
        }
       return query;
    }else {
        return query;
    }
}

export function buildPaginationResult<T>(rows:T[],limit:number,sortBy:string):{data:T[],meta:PaginationMeta} {
    console.log('rows length: ',rows.length);
    const hasMore = rows.length > limit;
    const data:T[] = hasMore ? rows.slice(0,limit) : rows;
    let nextCursor = null
    if(data && data.length > 0) {
        const lastItem = data[data.length - 1] as any;
        nextCursor = lastItem[sortBy];
    }
    return {
        data,
        meta: {
            nextCursor:nextCursor,
            hasMore:hasMore,
            count:data.length
        }
    }


}