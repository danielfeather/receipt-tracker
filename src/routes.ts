import {RequestHandler, Router, Request, Response} from 'express'
import Controller from "./controllers/Controller";
import WebhookController from "./controllers/WebhookController";
import IndexController from "./controllers/IndexController";

import prisma from "./database/client";

const router = Router()

// App routes
router.get('/', controller(IndexController, 'index', prisma))

// Webhook routes
router.get('/notification', controller(WebhookController, 'verify'))
router.post('/notification', controller(WebhookController, 'notification'))

function controller(controller: new (...args: any) => Controller, method: string, ...args: any): RequestHandler {

  return (req, res, next) => {

    const con: any = new controller(...args);

    con.setup(req, res)

    con[method]()

  }

}

export default router