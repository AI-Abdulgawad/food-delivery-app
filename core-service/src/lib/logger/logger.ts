export class Logger {
    private static instance: Logger = new Logger();


    constructor() {
        if(!Logger.instance)
        {
            Logger.instance = this
        }
        return Logger.instance
    }



    log(level:string , message:string , metadata={}) {

        const logObject=  {
            message : message,
            level:level,
            ...metadata
        }
        console.log(JSON.stringify(logObject))
    }

    info(message:string,metdata={}) {
        this.log('info',message,metdata)
    }

    error(message:string,metdata={}) {
        this.log('error',message,metdata)
    }

    warn(message:string,metdata={}) {
        this.log('warning',message,metdata)
    }

    debug(message:string,metdata={}) {
        this.log('debug',message,metdata)
    }





}
