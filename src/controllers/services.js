/* @Author: Raphael Nepomuceno <raphael.nepomuceno@ufv.br> */

import * as Router from '../utils/router.js'
import {
	$Service,
	$User,
	$ServiceCategory,
	sequelize,
	ValidationError
} from '../sequelize.js'

@Router.Route({
	route: '/services'
})
export class Service {
	@Router.Get('/category')
	static async getCategories(request, response) {

		return response.status(200).json({
			payload: await $ServiceCategory.findAll()
		})
	}

	@Router.Get('/category/add')
	static async addCategories(request, response) {

		return response.status(200).render('addCategory.pug')
	}

	@Router.Post('/category')
	static async insertCategory({
		body
	}, response) {
		try {
			const category = await $ServiceCategory.create({
				name: body.name,
				pricingType: body.pricingType
			})

			return response.status(200).json({
				payload: category
			})
		} catch (e) {
			if (e instanceof ValidationError === false)
				throw e

			return response.status(400).json({
				errors: e.errors.map(m => ({
					validatorKey: m.validatorKey,
					path: m.path
				}))
			})
		}
	}

	@Router.Get('/')
	static async profile(request, response) {
		const services = $Service.findAll({
			raw: true,
			include: [{
					model: $ServiceCategory
				},
				{
					model: $User
				}
			]
		})

		const categories = $ServiceCategory.findAll({
			raw: true
		})
		return response.render('services.pug', {
			user: request.session.user,
			services: await services,
			categories: await categories
		})
	}

	@Router.Get('/add')
	static async insertService(request, response) {
		const categories = $ServiceCategory.findAll({
			raw: true
		})

		if(!request.session.user){
			return response.render('error.pug',{
				status: 403,
				message: 'Acesso Negado',
				errors: 'Nenhum usuário está conectado. Efetue login para poder adicionar novos serviços!'
			})
		}

		return response.render('addService.pug', {
			categories: await categories
		})
	}

	@Router.Post('/')
	static async insert({
		body,
		session
	}, response) {
		const service = sequelize.transaction(async(transaction) => {
			const category = $ServiceCategory.findOne({
				where: {
					id: body.serviceCategoryId
				}
			})
			/*
			if(!session.user){
				return response.status(200).render('addService.pug', {
					errors: [ 'Nenhum usuário logado.' ],
					categories: await category
				})
			}
			*/
			const user = await $User.findOne({
				where: {
					id: session.user.id
				}
			}, {
				transaction
			})

			return $Service.create({
				title: body.title,
				description: body.description,
				basePrice: body.basePrice,
				serviceCategoryId: category,
				userId: user.id
			})
		})
		return response.status(200).render('regServiceSucess.pug')
	}

	@Router.Get('/:id')
	static async find({
		params
	}, response) {
		const user = await $Service.findOne({
			where: {
				id: params.id
			},
			attributes: {
				exclude: ['password', 'CPF']
			}
		})

		return response.status(200).json({
			payload: user
		})
	}
}