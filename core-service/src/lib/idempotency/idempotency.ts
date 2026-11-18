import type{Request,Response,NextFunction,RequestHandler} from 'express'
import container from '../di/container.js'
import {TOKENS} from "../di/tokens.js";
import type {RedisCacheProvider} from "../../pkg/cache/redis-cache-provider.js";
import {TimeUtils} from "../../pkg/time/time-utils.js";

interface IdempotencyOptions
{
    strict:boolean;
    userScoped:boolean
    userId?:string
}


export function idempotency(options:IdempotencyOptions={strict:false,userScoped:false,userId:'1'}):RequestHandler {
    const cacheProvider = container.resolve(TOKENS.CacheProvider)  as RedisCacheProvider
    return async (req:Request,res:Response,next:NextFunction) => {
        if(options.strict)
        {
              const idempotencyKey = req.header('Idempotency-Key') as string
            console.log(idempotencyKey)
              if(!idempotencyKey) {
                  return res.status(400).json({message:'Missing Idempotency-Key'})
              } else {

                  let key = `idempotency:${req.method}:${req.originalUrl}:${idempotencyKey}`
                  if(options.userScoped && !options.userId)
                     key += `:${req.user?.user_id}`

                  if(options.userScoped && options.userId) {
                      options.userId = req.body.email!;

                      key += `:${options.userId}`
                  }

                  const cached = await cacheProvider.get(key)
                  if(cached) {

                      res.setHeader('X-Cache', 'HIT')
                      return res.status(200).json(JSON.parse(cached));
                  }


                const jsonBody = res.json.bind(res)
                const ttl=TimeUtils.toMS(10,'m')

                res.json = (body) => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        cacheProvider.set(key, JSON.stringify(body), ttl).catch((err) => {console.log(err)})
                    }
                    res.setHeader('X-Cache', 'MISS')
                    return jsonBody(body)
                }
                  return next()


              }
        }else {
            return next();
        }
    }

}
