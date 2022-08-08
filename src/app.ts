import 'dotenv/config'
import express from 'express'
import nunjucks from 'nunjucks'
import Routes from './routes'
import bodyParser from 'body-parser'
import prisma from './database/client'
import { Strategy as MicrosoftStrategy } from 'passport-microsoft'

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
	saveUninitialized: false,
	resave: false
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(new MicrosoftStrategy({
	// Standard OAuth2 options
	clientID: process.env.MICROSOFT_CLIENT_ID as string,
	clientSecret: process.env.MICROSOFT_CLIENT_SECRET as string,
	callbackURL: process.env.MICROSOFT_REDIRECT_URI as string,
	scope: ['user.read'],
},async function(
	accessToken: string,
	refreshToken: string,
	profile: any,
	done: (err: any, user: any) => void
) {
	const user = await prisma.user.findFirst({
		where: {
			microsoftId: profile.id
		}
	})

	if (!user) {
		const user = await prisma.user.create({
			data: {
				name: profile.displayName,
				microsoftId: profile.id
			}
		})

		done(null, user)
		return
	}

	done(null, user)
}))

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