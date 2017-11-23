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
			/*
			if(!session.user){
				return response.status(200).render('addService.pug', {
					errors: [ 'Nenhum usuário logado.' ],
					categories: await category
				})
			}
			*/

			return $Service.create({
				title: body.title,
				description: body.description,
				basePrice: body.basePrice,
				serviceCategoryId: body.serviceCategoryId,
				userId: session.user.id
			})
		})
		return response.status(200).render('addServiceSucess.pug',{

		})
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