import express from "express"
import {appRouter} from "./app-router.js";
import {correlationId} from "./lib/correlation/correlation_id.js";
import {errorHandler} from "./lib/error_handler/exception_handler.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import {env} from "./lib/config/env.js";
import helmet from "helmet";

export  function createApp() {
    // create express app
    const app = express()

    // use helmet
    app.use(helmet());

    // use cors
    app.use(cors({origin: env.cors.origins}))

    // parse json body
    app.use(express.json())

    // assign a uniqueId to the Request
    app.use(correlationId)

    // cookie_parser
    app.use(cookieParser())
    // main app router
    app.use("/api", appRouter)

    // error Handler
    app.use(errorHandler)


    return app
}