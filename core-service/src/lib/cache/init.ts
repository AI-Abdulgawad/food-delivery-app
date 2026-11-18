import {RedisCacheProvider} from "../../pkg/cache/redis-cache-provider.js";
import {env} from "../config/env.js";


export const redisCacheProvide = new RedisCacheProvider(
    {
        host: env.redis.host,
        port: env.redis.port,
        password: env.redis.password,

    }
)