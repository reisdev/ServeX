/*! @Author: Raphael Nepomuceno <raphael.nepomuceno@ufv.br> */

import _ from 'lodash'
import moment from 'moment'

import { provinces, uploadPath } from '../settings'

import * as Router from '../utils/router.js'
import * as Middlewares from '../utils/middlewares.js'
import * as Utils from '../utils/utils.js'

import { $Address, $User, sequelize, $CreditCard } from '../sequelize.js'

import multer from 'multer'

const upload = multer({ dest: uploadPath })

const redirectIfAuthenticated = (request, response, next) => {
	return request.session.user ? response.redirect('/') : next()
}

@Router.Route('/user')
export class User
{
	@Router.Get('/logout')
	@Router.Post('/logout')
	static async logout(request, response)
	{
		request.session.destroy(err => response.redirect('/user/login'))
	}

	@Router.Get('/login', [ redirectIfAuthenticated ])
	static async loginPage (request, response)
	{
		return response.render('login.pug')
	}

	@Router.Post('/login/do', [ redirectIfAuthenticated ])
	static async login(request, response)
	{
		const { email, password } = request.body

		if (! email || ! password)
			return response.render('login.pug', { message: 'Preencha todos os campos.' })

		return await $User.findOne({
			where: { email },
			include: [{ model: $Address, required: false, where: { enabled: true } }]
		}).then(user => {
			if (! user)
				return response.render('login.pug', { message: 'Usuário inexistente.' })
			else if (! user.authenticate(password))
				return response.render('login.pug', { message: 'Senha incorreta.' })

			request.session.user = user
			request.session.save(err => response.redirect('/'))
		})
	}

	@Router.Get('/register', [ redirectIfAuthenticated, upload.single('photoPath') ])
	static async registerPage (request, response)
	{
		return response.render('register.pug', { provinces })
	}

	@Router.Post('/register/do', [ redirectIfAuthenticated, upload.single('photoPath') ])
	static async register ({ body, file, session }, response)
	{
		if (_.isEmpty(body))
			return response.status(400).render('register.pug', {
				provinces, error: [ 'Preencha todos os campos.' ]
			})

		if (body.password !== body.confirmPassword)
			return response.status(400).render('register.pug', {
				provinces, error: [ 'As senhas inseridas devem ser iguais.' ]
			})

		await sequelize.transaction(async (transaction) => {
			try {
				const user = await $User.create({
					...body,
					authLevel: 'Admin',
					photoPath: file ? file.filename : null,
					rating: 0
				}, { transaction })

				try {
					const addr = await $Address.create(
						{ ... body, userId: user.id },
						{ transaction }
					)

					body.validUntil = moment(`${body.validUntil}`,'MM YYYY')

					const card = await $CreditCard.create({
						... body, userId: user.id
					}, { transaction })

					session.user = user
					session.save(err => {
						response.render('success.pug', {
							user,
							message: 'Cadastro concluído com sucesso.'
						})
					})
				} catch (e) {
					response.status(400).render('register.pug', {
						provinces, error: [ 'Erro ao cadastrar endereço ou cartão.' ]
					})
				}
			} catch (e) {
				const mapPathToErrors = {
					email: 'E-mail já cadastrado.', CPF: 'CPF já cadastrado.'
				}
				response.status(400).render('error.pug', {
					error: 'Erro ao cadastrar',
					stack: e.stack
				})
			}
		})
	}
}
