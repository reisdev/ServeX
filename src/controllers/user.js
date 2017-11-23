/*! @Author: Raphael Nepomuceno <raphael.nepomuceno@ufv.br> */

import * as Router from '../utils/router.js'

import { $User, $Address, sequelize } from '../sequelize.js'

import _ from 'lodash'

const redirectIfAuthenticated = (request, response, next) => {
	return response.locals.loggedIn ? response.redirect('/') : next()
}

@Router.Route({ route: '/user' })
export class User
{
	@Router.Get('/')
	static async profile (request, response)
	{
		return response.status(200).json({
			payload: await $User.findAll({ attributes: { exclude: ['password', 'CPF'] } })
		})
	}

	@Router.All('/logout')
	static async logout (request, response)
	{
		request.session.destroy()
		return response.redirect('/user/login')
	}

	@Router.Get('/login', [ redirectIfAuthenticated ])
	static async login (request, response)
	{
		return response.render('login.pug')
	}

	@Router.Post('/login', [ redirectIfAuthenticated ])
	static async doLogin (request, response)
	{
		const { email, password } = request.body

		if(! email || ! password)
			return response.redirect('/login')

		return await $User.findOne({ where: { email } }).then(user => {
			if(! user)
				return response.render('login.pug', { message: 'Usuário inexistente.' })
			else if(! user.authenticate(password))
				return response.render('login.pug', { message: 'Senha incorreta.' })

			request.session.user = user
			return response.redirect('/')
		})
	}

	@Router.Get('/register', [ redirectIfAuthenticated ])
	static async viewSignup (request, response)
	{
		return response.render('register.pug')
	}

	@Router.Post('/register', [ redirectIfAuthenticated ])
	static async register (request, response)
	{
		if(_.isEmpty(request.body))
			return response.status(400).render('register.pug', {
				errors: [ 'Preencha todos os campos.' ]
			})

		const body = request.body

		try {
			const service = await sequelize.transaction(async (transaction) => {
				const user = await $User.create({
					... body, authLevel: 'Admin', rating: 0
				}, { transaction })

				$Address.create({ ... body, userId: user.id }, { transaction })

				return user
			})

			return response.render('registerSuccess.pug')
		} catch (e) {
			const mapPathToErrors = {
				email: 'E-mail já cadastrado.',
				CPF: 'CPF já cadastrado.'
			}

			return response.status(400).render('register.pug', {
				errors: e.errors.map(p => mapPathToErrors[p.path] || p.path)
			})
		}
	}

	@Router.Post('/')
	static async insert (request, response)
	{
		const u = await $User.create({
			email: request.body.email,
			password: request.body.password,
			CPF: request.body.CPF,
			fullName: request.body.fullName,
			photoPath: request.body.photoPath
		})

		return response.status(200).json({ payload: { id: u.id } })
	}

	static async find ({ params }, response)
	{
		const user = await $User.findOne({
			where: { id: params.id },
			attributes: {
				exclude: ['password', 'CPF']
			}
		})

		return response.status(200).json({ payload: user })
	}
}
