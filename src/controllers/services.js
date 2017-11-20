/**
 * @Author: Raphael Nepomuceno <raphael.nepomuceno@ufv.br>
 * @Date:   2017-11-07
 */

import { Router, Get, Post, MuteExceptions } from '../utils/routeDecorators.js'
import { $Service, $User, $ServiceCategory, sequelize, ValidationError } from '../sequelize.js'

@Router({ route: '/services' })
export class Service
{
	@Get('/category')
	static async getCategories (request, response)
	{
		return response.status(200).json({
			payload: await $ServiceCategory.findAll()
		})
	}

	@Post('/category')
	static async insertCategory ({ body }, response)
	{
		try {
			const category = await $ServiceCategory.create({
				name: body.name,
				pricingType: body.pricingType
			})

			return response.status(200).json({
				payload: category
			})
		} catch (e) {
			if(e instanceof ValidationError === false)
				throw e

			return response.status(400).json({
				errors: e.errors.map(m => ({ validatorKey: m.validatorKey, path: m.path }))
			})
		}
	}

	@Get('/')
	static async profile (request, response)
	{
		const services = $Service.findAll({
			raw: true,
			include: [
				{ model: $ServiceCategory },
				{ model: $User }
			]
		})

		const categories = $ServiceCategory.findAll({
			raw: true
		})

		return response.render('services.pug', {
			services: await services,
			categories: await categories
		})
	}

	@Post('/')
	static async insert ({ body }, response)
	{
		const service = sequelize.transaction(async (transaction) => {
			const category = $ServiceCategory.findOne({ where: { id: body.serviceCategoryId } }, { transaction })
			const user = $User.findOne({ where: { id: body.userId } }, { transaction })

			return $Service.create({
				title: body.title,
				description: body.description,
				basePrice: body.basePrice,
				serviceCategoryId: (await category).id,
				userId: (await user).id
			})
		})

		return response.status(200).json({
			payload: await service
		})
	}

	@Get('/:id')
	static async find ({ params }, response)
	{
		const user = await $Service.findOne({
			where: { id: params.id },
			attributes: {
				exclude: ['password', 'CPF']
			}
		})

		return response.status(200).json({ payload: user })
	}
}
