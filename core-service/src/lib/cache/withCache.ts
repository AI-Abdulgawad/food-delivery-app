import type {Request,Response,NextFunction,RequestHandler} from "express";
import {TOKENS} from "../di/tokens.js";
import container from '../di/container.js'
import type {ICacheProvider} from "../../pkg/cache/cache-provider.interface.js";


export  function withCache(ttl:number,userScoped=false):RequestHandler {

    return async (req:Request, res, next) =>
    {
       try{
            const cache: ICacheProvider = container.resolve(TOKENS.CacheProvider)
            let key = `${req.method.toUpperCase()}:${req.originalUrl}`

            if (userScoped) {
                key = key + `${req.user?.user_id}`
            }
            const result = await cache.get(key)
            if (result) {
                res.setHeader('X-Cache', 'HIT')
                return res.status(200).json(JSON.parse(result))
            }

            const originalJsonBody = res.json.bind(res)

            res.json =  (body) =>  {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                     cache.set(key, JSON.stringify(body), ttl).catch((err) => {console.log(err)})
                }
                    res.setHeader('X-Cache', 'MISS')
                return originalJsonBody(body)
            }
            next()
        }catch(err) {
           next(err)
       }

    }


}