/* @Author: Raphael Nepomuceno <raphael.nepomuceno@ufv.br> */

import * as Router from '../utils/router.js'
import * as Middlewares from '../utils/middlewares.js'

import { $Service, $Contract, $ServiceCategory, sequelize } from '../sequelize.js'

@Router.Route('/cpanel', [
	Middlewares.restrictedPage({
		message: 'Área restrita a administradores.',
		test: (user) => user.authLevel === 'Admin'
	})
])
export class ControlPanel
{
	@Router.Get('/')
	static async index ({ params }, response)
	{
		return response.render('controlPanel/index.pug')
	}

	@Router.Get('/rank/users')
	static async rankUsers ({ params }, response)
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

			return response.render('controlPanel/weightedRanking.pug', { ranking })
		} catch (e) {
			return response.status(400).render('error.pug', {
				status: '0x05',
				error: 'Erro ao computar relatório',
				message: 'Erro desconhecido.',
				stack: e.stack
			})
		}
	}

	@Router.Get('/rank/categories')
	static async rank({ query }, response)
	{
		const sql = `SELECT
				serviceCategories.name AS category,
				serviceCategories.id AS categoryId,
				COUNT(*) AS count,
				AVG(users.rating) AS rating,
				SUM(contracts.totalPrice) AS totalprice
				FROM services
				INNER JOIN serviceCategories ON serviceCategories.id = services.serviceCategoryId
				INNER JOIN contracts ON services.id = contracts.serviceId
				INNER JOIN users ON users.id = services.userId
				GROUP BY services.id
				ORDER BY count DESC`

		try {
			const ranking = await sequelize.query(sql, {
				type: sequelize.QueryTypes.SELECT
			})

			return response.render('controlPanel/categoryRanking.pug', { ranking })
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
				serviceCategories.name AS categoryName,
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
			INNER JOIN contracts ON "contracts.userId" = users.id
			INNER JOIN services ON "contracts.serviceId" = services.id
			INNER JOIN serviceCategories ON serviceCategories.id = "services.serviceCategoryId"
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
}
