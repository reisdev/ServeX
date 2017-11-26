/*! @Author: Matheus Reis <matheus.r.jesus@ufv.br */

import * as Router from '../utils/router.js'
import * as Middlewares from '../utils/middlewares.js'

import { $ServiceCategory, sequelize } from '../sequelize.js'

@Router.Route({ route: '/categories', middlewares: [
	Middlewares.restrictedPage({ message: 'Área restrita a administradores.' })
]})
export class ServiceCategory
{
	@Router.Get('/new')
	static async addCategories(request, response)
	{
		return response.render('addCategory.pug')
	}

	@Router.Post('/new')
	static async insertCategory({ body }, response)
	{
		const { name, pricingType } = body

		if(! name || ! pricingType )
			return response.status(400).render('addCategory.pug', {
				errors: [ 'Preencha todos os campos.' ]
			})

		try {
			const category = await $ServiceCategory.create({
				name: body.name,
				pricingType: body.pricingType
			})

			return response.render('addCategory.pug', {
				success: 'Categoria cadastrada com sucesso!'
			})
		} catch (e) {
			return response.status(400).render('addCategory.pug', {
				errors: e.errors.map(p => p.message)
			})
		}
	}

	@Router.Get('/:id')
	static async find({ params }, response)
	{
		const user = await $ServiceCategory.findOne({
			where: { id: params.id },
		})

		return response.render('services.pug')
	}
}
