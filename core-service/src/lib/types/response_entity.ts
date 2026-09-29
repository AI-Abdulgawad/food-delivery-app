import type {Response} from 'express';
interface ApiResponse<T extends Object> {
    success: boolean;
    data?:T,
    meta?:Object
}

interface PaginationMetadata {
    newCursor:number
    hasMore:boolean
    count:number
}

export const sendSuccess = <T extends Object>(response:Response,data:T,meta?:Object)=>{
    const body:ApiResponse<T> = {success:true,data:data}
    if(meta) body.meta = meta
    return response.status(200).json(body)
}

export const sendPaginated = <T extends Object>(response:Response,data:T,meta:Object)=>{
    const body:ApiResponse<T> = {success:true,data:data,meta:meta}
    sendSuccess(response,data,meta)
}
