/**
 * @Author: Raphael Nepomuceno <raphael.nepomuceno@ufv.br>
 * @Date:   2017-11-06
 */

import express from 'express'
import bodyParser from 'body-parser'

import { SERVER_PORT } from './settings.js'
import { sequelize } from './sequelize.js'

import { UserEndpoint, ServiceEndpoint } from './endpoints'

const app = express()

// Roteia os arquivos da front-end.
app.use('/', express.static('public'))

// Converte o corpo das requests para JSON automaticamente.
app.use(bodyParser.json())

// Registra as rotas
UserEndpoint.registerRoutes(app)
ServiceEndpoint.registerRoutes(app)

// Realiza a conexão com o banco de dados. Caso suceda, inicia o servidor HTTP.
// Caso contrário, fecha a aplicação.
sequelize.authenticate().then(() => {
	// Inicia o servidor.
	app.listen(SERVER_PORT, () => console.log('\x1b[34m[%s]\x1b[0m %s', 'servex', '🍻 Servidor iniciado.'))
}).catch(err => {
	console.error('\x1b[31m[%s]\x1b[0m %s', 'server error', err)
	process.exit(1)
})
