import {RequestHandler, Router} from 'express'
import Controller from './controllers/Controller'
import WebhookController from './controllers/WebhookController'
import IndexController from './controllers/IndexController'

import prisma from './database/client'
import passport from 'passport'

const router = Router()

// Login routes
router.get('/login', passport.authenticate('microsoft'))
router.get('/login/callback', passport.authenticate('microsoft', { failureRedirect: '/login' }), function (req, res) {
	res.redirect('/app/dashboard')
})

const appRouter = Router()

appRouter.use((req, res, next) => req.isAuthenticated() ? next(): res.redirect('/login'))
// App routes
appRouter.get('/dashboard', controller(IndexController, 'index', prisma))

router.use('/app', appRouter)
// Webhook routes
router.get('/notification', controller(WebhookController, 'verify'))
router.post('/notification', controller(WebhookController, 'notification'))

function controller(controller: new (...args: any) => Controller, method: string, ...args: any): RequestHandler {

	return (req, res, next) => {

		const con: any = new controller(...args)

		con.setup(req, res)

		con[method]()

	}

}

export default router