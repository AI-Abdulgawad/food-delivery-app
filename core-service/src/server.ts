import 'reflect-metadata'

import {createApp} from "./core-app.js";
import {db} from './lib/knex/knex.js'
import {env} from "./lib/config/env.js";
import http from "http";

const app = createApp()

const server = http.createServer(app)

server.listen(env.port, () => {console.log(`Server started on ${env.port}`)})

async function shutdown() {
    await db.destroy()
    console.log(`Database shutdown`)
    process.exit(0)
}

process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)
