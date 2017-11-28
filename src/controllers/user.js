/*! @Author: Raphael Nepomuceno <raphael.nepomuceno@ufv.br> */

import _ from 'lodash'

import { provinces, uploadPath } from '../settings'
import * as Router from '../utils/router.js'

import { $Address, $User, sequelize } from '../sequelize.js'

import multer from 'multer'

const upload = multer({ dest: uploadPath })

const redirectIfAuthenticated = (request, response, next) => {
	return request.session.user ? response.redirect('/') : next()
}

@Router.Route({ route: '/user' })
export class User
{
	@Router.Get('/')
	static async all(request, response)
	{
		return response.status(200).json({
			payload: await $User.findAll()
		})
	}

	@Router.Get('/weighted')
	static async weightedRating({ params }, response)
	{
		const sql = `SELECT
			r.receiverId,
			u.fullname,
			AVG(r.rating) AS average,
			COUNT(*) AS count,
			1.0 * (:confidence * :alpha + SUM(r.rating)) / (:confidence + COUNT(*)) AS normalizedScore
			FROM reviews r
			INNER JOIN users u ON u.id = r.receiverId
			GROUP BY receiverId`

		try {
			const ranking = await sequelize.query(sql, {
				type: sequelize.QueryTypes.SELECT,
				replacements: {
					id: params.id,
					// Represents a prior for the average of the stars.
					alpha: 2.5,
					// Represents how confident we're in our prior.
					// It is equivalent to a number of observations.
					confidence: 5.0
				}
			})

			//return response.json(ranking)
			return response.render('weightedRanking.pug', {
				ranking
			})
		} catch (e) {
			return response.status(400).render('error.pug', {
				status: '0x05',
				error: 'Erro ao computar relatório',
				message: 'Erro desconhecido.',
				stack: e.stack
			})
		}
	}

	@Router.Get('/:id/report/services')
	static async serviceReport({ params }, response)
	{
		const sql = `SELECT users.fullname,
			serviceCategories.name AS category,
			services.title AS title,
			SUM(contracts.totalPrice) AS sum,
			COUNT(*) AS count,
			AVG(contracts.totalPrice) AS avg
			FROM users
			INNER JOIN services ON users.id = services.userId
			INNER JOIN contracts ON contracts.serviceId = services.id
			INNER JOIN serviceCategories ON serviceCategories.id = services.serviceCategoryId
			WHERE users.id = :id
			GROUP BY services.id
			ORDER BY SUM(contracts.totalPrice) DESC`

		try {
			const rank = await sequelize.query(sql, {
				type: sequelize.QueryTypes.SELECT,
				replacements: {
					id: params.id
				}
			})

			return response.json(rank)
		} catch (e) {
			return response.status(400).render('error.pug', {
				status: '0x05',
				error: 'Erro ao computar relatório',
				message: 'Erro desconhecido.',
				stack: e.stack
			})
		}
	}

	@Router.Get('/:id/report')
	static async userReport({ params }, response)
	{
		const sql = `SELECT
				users.fullname AS fullname,
				serviceCategories.name AS category,
				services.title AS title,
				contracts.totalPrice AS price,
				services.basePrice AS baseprice,
				serviceCategories.pricingType AS pricingType
			FROM users
			INNER JOIN contracts ON contracts.userId = users.id
			INNER JOIN services ON contracts.serviceId = services.id
			INNER JOIN serviceCategories ON serviceCategories.id = services.serviceCategoryId
			WHERE users.id = :id
			ORDER BY contracts.totalPrice DESC`

		try {
			const rank = await sequelize.query(sql, {
				type: sequelize.QueryTypes.SELECT,
				replacements: {
					id: params.id
				}
			})

			return response.json(rank)
		} catch (e) {
			return response.status(400).render('error.pug', {
				status: '0x05',
				error: 'Erro ao computar relatório',
				message: 'Erro desconhecido.',
				stack: e.stack
			})
		}
	}

	@Router.Get('/logout')
	@Router.Post('/logout')
	static async logout(request, response)
	{
		request.session.destroy(err => {
			response.redirect('/user/login')
		})
	}

	@Router.Get('/login', [ redirectIfAuthenticated ])
	@Router.Post('/login', [ redirectIfAuthenticated ])
	static async login(request, response)
	{
		const { email, password } = request.body

		if (!email || !password)
			return response.render('login.pug')

		return await $User.findOne({
			where: { email }
		}).then(user => {
			if (!user)
				return response.render('login.pug', { message: 'Usuário inexistente.' })
			else if (!user.authenticate(password))
				return response.render('login.pug', { message: 'Senha incorreta.' })

			request.session.user = user
			request.session.save(err => {
				response.redirect('/')
			})
		})
	}

	@Router.Get('/register', [ redirectIfAuthenticated, upload.single('photoPath') ])
	@Router.Post('/register', [ redirectIfAuthenticated, upload.single('photoPath') ])
	static async register({ body, file }, response)
	{
		if (_.isEmpty(body))
			return response.status(400).render('register.pug', {
				provinces: provinces,
				error: ['Preencha todos os campos.']
			})

		if (body.password !== body.confirmPassword)
			return response.status(400).render('register.pug', {
				provinces: provinces,
				error: ['As senhas inseridas não são iguais.']
			})


		try {
			await sequelize.transaction(async(transaction) => {
				const user = await $User.create({
					...body,
					authLevel: 'Admin',
					photoPath: file.filename,
					rating: 0
				}, {
					transaction
				})

				const addr = await $Address.create({
					...body,
					userId: user.id
				}, {
					transaction
				})

				return user
			})

			return response.render('success.pug', {
				message: 'Cadastro Concluído!'
			})
		} catch (e) {
			const mapPathToErrors = {
				email: 'E-mail já cadastrado.',
				CPF: 'CPF já cadastrado.'
			}

			return response.status(400).render('register.pug', {
				provinces: provinces,
				error: e.errors.map(p => mapPathToErrors[p.path] || p.path)
			})
		}
	}

	@Router.Get('/:id')
	static async viewUser({ params }, response)
	{
		const user = await $User.findOne({
			where: { id: params.id }
		})

		if(! user)
			return response.status(400).render('error.pug', {
				error: 'Usuário não encontrado',
				message: 'O usuário solicitado não foi encontrando em nossa base de dados'
			})

		return response.render('user.pug', { user })
	}
}
