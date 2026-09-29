"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
var dotenv_1 = require("dotenv");
var zod_1 = require("zod");
(0, dotenv_1.config)();
var schema = zod_1.z.object({
    // server port
    PORT: zod_1.z.string(),
    // database url
    DB_HOST: zod_1.z.string(),
    //database port
    DB_PORT: zod_1.z.string(),
    //database username
    DB_USER: zod_1.z.string(),
    // database password
    DB_PASSWORD: zod_1.z.string(),
    // database name
    DB_NAME: zod_1.z.string(),
    // max pool connections
    DB_POOL_MAX: zod_1.z.string(),
});
var parsed = schema.parse(process.env);
exports.env = {
    port: parseInt(parsed.PORT, 10),
    db: {
        host: parsed.DB_HOST,
        username: parsed.DB_USER,
        password: parsed.DB_PASSWORD,
        port: parseInt(parsed.DB_PORT, 10),
        name: parsed.DB_NAME,
        maxPool: parseInt(parsed.DB_POOL_MAX, 10)
    }
};
