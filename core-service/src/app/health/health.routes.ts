import {Router}  from "express";
import {pingDB} from "../../lib/knex/knex.js";

export const healthRouter = Router();

healthRouter.get('/health', async (req, res) => {
    try {
        await pingDB()
        res.status(200).send('OK')
    }catch (error) {
        res.status(500).json({message: 'DB is down'})
    }
});