/**
 * @Author: Raphael Nepomuceno <raphael.nepomuceno@ufv.br>
 * @Date:   2017-11-06
 */

export const SERVER_PORT = 44800

const Postgres = [
	'postgres://postgres:servex@localhost:5432/servex', // URI
	{ // Options
		dialect: 'postgres',
		logging: false,
		define: { timestamps: false }
	}
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

export const schema = (() => {
	switch(process.env.USER)
	{
		case 'kurumi': return SQLite
		default: return Postgres
	}
})()
