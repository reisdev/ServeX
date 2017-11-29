/*! @Author: Matheus Reis <matheus.r.jesus@ufv.br */

import * as Router from '../utils/router.js'
import * as Middlewares from '../utils/middlewares.js'

import { $Service, $Contract, $ServiceCategory, sequelize } from '../sequelize.js'

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

	@Router.Get('/rank')
	static async rank({ query }, response)
	{
		const sql = `SELECT services.id, serviceCategories.name, COUNT(*) AS count
				FROM services
				INNER JOIN serviceCategories ON serviceCategories.id = services.serviceCategoryId
				INNER JOIN contracts ON services.id = contracts.serviceId
				GROUP BY contracts.serviceId
				ORDER BY count DESC`

		try {
			const rank = await sequelize.query(sql, {
				type: sequelize.QueryTypes.SELECT
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

	@Router.Get('/volume/:id')
	static async volume({ params }, response)
	{
		const sql = `SELECT
				users.fullname AS userName,
				serviceCategories.name as categoryName,
				COUNT(*) AS count
				FROM contracts
				INNER JOIN users ON contracts.userId = users.id
				INNER JOIN services ON contracts.serviceId = services.id
				INNER JOIN serviceCategories ON services.serviceCategoryId = serviceCategories.id
				WHERE serviceCategories.id = :id
				GROUP BY users.id`

		try {
			const rank = await sequelize.query(sql, {
				type: sequelize.QueryTypes.SELECT,
				replacements: { id: params.id }
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
