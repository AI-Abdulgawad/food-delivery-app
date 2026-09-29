declare namespace Express {
    interface Request {
        correlationId?: string;
        user?:{
            user_id: number;
            email: string;
            role: string;
            name: string;
            phone: string;
        },
       restaurantUser?: {
            restaurantId?:number[],
           branchId?:number[],
           roleName?:string,
        }

    }
}