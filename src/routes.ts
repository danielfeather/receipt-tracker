import {RequestHandler, Router} from 'express'
import Controller from './controllers/Controller'
import WebhookController from './controllers/WebhookController'
import IndexController from './controllers/IndexController'

import prisma from './database/client'
import passport from 'passport'

const router = Router()

router.get('/', (req, res) => res.render('index'))

// Login routes
router.get('/login', passport.authenticate('openid-client'))
router.get('/login/callback', passport.authenticate('openid-client'), (req, res) => {
	res.redirect('/app/dashboard')
})
router.get('/logout', (req, res) => {

	req.logout(() => res.redirect('/'))

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