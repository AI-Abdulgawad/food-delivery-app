export class AppError extends Error{
    private isOperational: boolean;
    private statusCode: number;


    constructor(message:string,isOperational = true , statusCode = 400) {
        super(message)
        this.isOperational = isOperational
        this.statusCode = statusCode
        Error.captureStackTrace(this,this.constructor)
    }

    getIsOperational(){
        return this.isOperational;
    }
    setIsOperational(isOperational:boolean){
        this.isOperational = isOperational;
    }
    getStatusCode(){
        return this.statusCode;
    }
    setStatusCode(statusCode:number){
        this.statusCode = statusCode;
    }

}
