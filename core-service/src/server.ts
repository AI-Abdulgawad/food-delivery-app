import 'reflect-metadata'

import {createApp} from "./core-app.js";
import {db} from './lib/knex/knex.js'
import {env} from "./lib/config/env.js";
import http from "http";
import {container} from "tsyringe";
import {TOKENS} from "./lib/di/tokens.js";
import type {MailJetProvider} from "./pkg/email/MailJetProvider.js";

const app = createApp()

const server = http.createServer(app)

server.listen(env.port,  () => {console.log(`Server started on ${env.port}`)})
//
// async function testEmailService() {
//     const provider:MailJetProvider = await container.resolve(TOKENS.MailJetProvider)
//     await provider.send('stu.ahmed.11@gmail.com',"Testing node app","<h1>Hello from Node</h1>")
// }


async function shutdown() {
    await db.destroy()
    console.log(`Database shutdown`)
    process.exit(0)
}

process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)