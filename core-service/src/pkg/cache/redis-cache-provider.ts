import type {ICacheProvider} from "./cache-provider.interface.js";
import {Redis} from 'ioredis'
interface RedisConfig {
    host: string;
    port: number;
    password: string;
}

export class RedisCacheProvider implements ICacheProvider {

    private readonly client:Redis

    constructor(private readonly config: RedisConfig) {

        this.client = new Redis({
            host: config.host,
            port: config.port,
            password: config.password,
            lazyConnect: true,
        })
        this.client.on('error', (err) => {console.error(err)})
        this.client.connect().catch(err => {console.error(err)})
    }
    async set(key: string, value: any,ttl:number): Promise<void> {
        await this.client.set(key, value,'EX',ttl)
    }

    async get(key: string): Promise<any>{
        return await this.client.get(key)
    }
   async delete(key: string): Promise<void> {
        await this.client.del(key)
    }


}