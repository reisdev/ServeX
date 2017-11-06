/**
 * @Author: Raphael Nepomuceno <raphael.nepomuceno@ufv.br>
 * @Date:   2017-11-06
 */

import express from 'express'
import bodyParser from 'body-parser'

import { SERVER_PORT } from './settings.js'

import { sequelize } from './schema/sequelize.js'
const app = express()

// Roteia os arquivos da front-end.
app.use('/', express.static('public'))

// Converte o corpo das requests para JSON automaticamente.
app.use(bodyParser.json())

// Inicia o servidor.
app.listen(SERVER_PORT, () => console.log('\x1b[34m[servex]\x1b[0m %s', '🍻 Servidor iniciado.'))

sequelize.authenticate()