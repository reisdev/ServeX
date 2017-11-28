/** @Author: Raphael Nepomuceno <raphael.nepomuceno@ufv.br> */

import path from 'path'

export const uploadPath = path.join(__dirname, '..', 'public', 'upload')

export const SERVER_PORT = 44800

export const provinces = [
	{ name: 'Amazonas', value: 'AM'},
	{ name: 'Bahia', value: 'BA'},
	{ name: 'Ceará', value: 'CE'},
	{ name: 'Distrito Federal', value: 'DF'},
	{ name: 'Espírito Santo', value: 'ES'},
	{ name: 'Goiás', value: 'GO'},
	{ name: 'Maranhão', value: 'MA'},
	{ name: 'Mato Grosso', value: 'MT'},
	{ name: 'Mato Grosso do Sul', value: 'MS'},
	{ name: 'Minas Gerais', value: 'MG'},
	{ name: 'Pará', value: 'PA'},
	{ name: 'Paraná', value: 'PR'},
	{ name: 'Paraíba', value: 'PB'},
	{ name: 'Pernambuco', value: 'PE'},
	{ name: 'Piauí', value: 'PI'},
	{ name: 'Rio de Janeiro', value: 'RJ'},
	{ name: 'Rio Grande do Norte', value: 'RN'},
	{ name: 'Rio Grande do Sul', value: 'RS'},
	{ name: 'Rondônia', value: 'RO'},
	{ name: 'Roraima', value: 'RR'},
	{ name: 'São Paulo', value: 'SP'},
	{ name: 'Santa Catarina', value: 'SC'},
	{ name: 'Sergipe', value: 'SE'},
	{ name: 'Tocantins', value: 'TO'},
	{ name: 'Fora do Brasil', value: 'EX'}
]

const SQLite = [
	null, // URI
	null, // Username
	null, // Password
	{ // Options
		dialect: 'sqlite',
		storage: 'dev-db.sqlite3',
		define: { timestamps: false }
	}
]

export const forceRebuild = false
export const schema = SQLite
