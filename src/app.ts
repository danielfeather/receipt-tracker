import 'dotenv/config'
import express from 'express'
import nunjucks from 'nunjucks'
import Routes from './routes'
import bodyParser from 'body-parser'
import prisma from './database/client'
import {Strategy, generators, TokenSet} from 'openid-client'

const app = express()

import passport from 'passport'

passport.serializeUser((user: any, done) => {

	done(null, user.id)

})

passport.deserializeUser(async (id: number, done) => {

	const user = await prisma.user.findFirst({
		where: {
			id: {
				equals: id
			}
		}
	})

	done(null, user)

})

import session from 'express-session'

app.use(session({
	secret: 'testing',
	saveUninitialized: true,
	resave: false
}))

app.use(passport.initialize())
app.use(passport.session())

import { Issuer } from 'openid-client'
import { config } from '../config/config'

Issuer.discover('https://login.microsoftonline.com/common')
	.then((microsoft) => {
		const client = new microsoft.Client({
			client_id: config('microsoft.clientId'),
			client_secret: config('microsoft.clientSecret'),
			redirect_uris: ['http://localhost:3000/login/callback'],
			response_types: ['code token id_token'],
		})

		const params = {
			client_id: process.env.MICROSOFT_CLIENT_ID,
			response_type: 'code',
			scope: 'openid profile email offline_access Files.ReadWrite',
			nonce: generators.nonce(),
			redirect_uri: 'http://localhost:3000/login/callback',
			state: generators.state(),
			prompt: 'select_account',
		}

		const verify = async ( tokenSet: TokenSet, userInfo: any, done: (arg0: null, arg1: any) => void ) => {

			let user = undefined

			user = await prisma.user.findFirst({
				where: {
					microsoftId: userInfo.sub
				}
			})

			if (!user) {
				user = await prisma.user.create({
					data: {
						name: userInfo.name,
						microsoftId: userInfo.sub
					}
				})
			}


			await prisma.user.update({
				where: {
					id: user.id
				},
				data: {
					name: userInfo.name,
					refreshToken: tokenSet.refresh_token
				}
			})

			done(null, user)
		}

		const options = {
			client,
			params,
		}
		passport.use('openid-client', new Strategy( options, verify ))
	}).catch((err: any) => {
		if (err) {
			console.log(err)
		}
	})

nunjucks.configure([
	'views',
], {
	autoescape: true,
	express: app
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

app.use(express.static('public'))

app.set('view engine', 'njk')

app.use(Routes)

export default app