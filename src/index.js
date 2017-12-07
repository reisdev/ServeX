/**
* @Author: Raphael Nepomuceno <raphael.nepomuceno@ufv.br>
* @Date:   2017-11-06
*/

import 'moment/locale/pt-br'

import _ from 'lodash'
import bodyParser from 'body-parser'
import express from 'express'
import moment from 'moment'
import path from 'path'
import session from 'express-session'
import uid from 'uid-safe'
import url from 'url'

import * as Controllers from './controllers'

import { sequelize } from './sequelize'
import { SERVER_PORT, forceRebuild, provinces } from './settings'

const SequelizeStore = require('connect-session-sequelize')(session.Store)

// Realiza a conexão com o banco de dados. Caso suceda, inicia o servidor HTTP.
// Caso contrário, fecha a aplicação.
sequelize.authenticate().then(() => {
	const app = express()

	moment.locale('pt-br')

	// Roteia os arquivos da front-end.
	app.use('/public', express.static('public'))

	// Carrega o engine de templates
	app.set('view engine', 'pug')
	app.set('views', path.join(__dirname, '/views'))

	const sessionStore = new SequelizeStore({ db: sequelize })
	sessionStore.sync({ force: forceRebuild || false })

	// Enable support for sessions
	app.use(session({
		key: 'sid',
		resave: false,
		saveUninitialized: false,
		secret: 'Morgenstern',
		store: sessionStore,
	}))

	// To support JSON-encoded bodies
	app.use(bodyParser.json())

	// To support URL-encoded bodies
	app.use(bodyParser.urlencoded({ extended: true }))

	// Expoẽ a rota local ao pug
	app.use((req, res, next) => {
		res.locals.request = req
		res.locals.user = req.session.user
		res.locals.uniqueFormKey = () => uid.sync(18)
		res.locals.isLoggedIn = !_.isEmpty(req.session.user)
		res.locals.provinces = provinces

		res.locals.baseurl = resource => url.resolve('http://localhost:44800/', resource)

		return next()
	})

	// Registra as rotas
	Object.getOwnPropertyNames(Controllers).forEach((p) => {
		if (Controllers[p].registerRoutes) Controllers[p].registerRoutes(app)
	})

	// Página 404
	app.all('*', (request, response) => response.status(404).render('error.pug', {
		status: 404,
		message: 'Página não encontrada',
		error: 'Página não encontrada',
	}))

	// Inicia o servidor.
	app.listen(SERVER_PORT, () => console.log('\x1b[34m[%s]\x1b[0m %s', 'servex', '🍻 Servidor iniciado na porta', SERVER_PORT))
}).catch((err) => {
	console.error('\x1b[31m[%s]\x1b[0m %s', 'server error', err)
	process.exit(1)
})
