import {config} from 'dotenv'
import {z} from 'zod'
import path from 'node:path'
// D:\Node\food-deivery-app\src\lib\config
config({path: path.resolve(import.meta.dirname,'../../../', '.env')})

const schema = z.object({

    // server port
    PORT:z.string(),

    // database url
    DB_HOST:z.string(),
    //database port
    DB_PORT:z.string(),

    //database username
    DB_USER:z.string(),
    // database password
    DB_PASSWORD:z.string(),
    // database name
    DB_NAME:z.string(),
    // max pool connections
    DB_POOL_MAX:z.string(),

    // database migration directory
    DB_MIGRATION_DIRECTORY:z.string(),

    // database migration extension
    DB_MIGRATION_EXTENSION:z.string(),

    ACCESS_SECRET:z.string(),
    REFRESH_SECRET:z.string(),
    ACCESS_EXPIRES_IN:z.string(),
    REFRESH_EXPIRES_IN:z.string(),
    NODE_ENV: z.string(),
    CORS_ORIGINS:z.string().default("http://localhost:8888"),
})

const parsed = schema.parse(process.env)

export const env = {
    port: parseInt(parsed.PORT, 10),
    db: {
        host: parsed.DB_HOST,
        username: parsed.DB_USER,
        password: parsed.DB_PASSWORD,
        port: parseInt(parsed.DB_PORT, 10),
        name: parsed.DB_NAME,
        maxPool: parseInt(parsed.DB_POOL_MAX,10),
        //D:\Node\food-deivery-app\src\migration
        //D:\Node\food-deivery-app\src\lib\config\env
        migrationDirectory: path.resolve(import.meta.dirname,'../../migration'),
        migrationExtension: parsed.DB_MIGRATION_EXTENSION,
    },
    jwt: {
        accessSecret: parsed.ACCESS_SECRET,
        refreshSecret: parsed.REFRESH_SECRET,
        accessExpiresIn: parsed.ACCESS_EXPIRES_IN,
        refreshExpiresIn: parsed.REFRESH_EXPIRES_IN,
    },
    NODE_ENV: parsed.NODE_ENV,
    cors: {
        origins: parsed.CORS_ORIGINS.split(","),
    }

}



