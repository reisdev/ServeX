/* @Author: Raphael Nepomuceno <raphael.nepomuceno@ufv.br> */

import * as Router from '../utils/router.js'
import * as Middlewares from '../utils/middlewares.js'

import { $Service, $ServiceCategory, $User, sequelize } from '../sequelize.js'

@Router.Route({ route: '/services' })
export class Service
{
	@Router.Get('/')
	@Router.Get('../')
	static async index(request, response)
	{
		const services = $Service.findAll({
			raw: true,
			include: [ $ServiceCategory, $User ]
		})

		const categories = $ServiceCategory.findAll({ raw: true })

		return response.render('services.pug', {
			services: await services,
			categories: await categories
		})
	}

	@Router.Get('/filter/:id')
	static async filter({ params }, response)
	{
		console.log(params)
		const services = $Service.findAll({
			raw: true,
			where: { serviceCategoryId: params.id },
			include: [ $ServiceCategory, $User ]
		})

		const categories = $ServiceCategory.findAll({
			raw: true
		})

		return response.render('services.pug', {
			services: await services,
			categories: await categories
		})
	}

	@Router.Get('/add', [
		Middlewares.restrictedPage('Efetue login para adicionar um serviço.')
	])
	static async insertForm (request, response)
	{
		const categories = $ServiceCategory.findAll({ raw: true })

		return response.render('addService.pug', {
			categories: await categories
		})
	}

	@Router.Post('/', [
		Middlewares.restrictedPage('Efetue login para adicionar um serviço.')
	])
	static async doInsert ({ body, session }, response)
	{
		return await sequelize.transaction(async (transaction) => {
			const category = await $ServiceCategory.findOne({
				where: { id: body.serviceCategoryId }
			}, { transaction })

			if(! category)
				return response.status(400)

			const service = await $Service.create({ ... body, serviceCategoryId: category.id, userId: session.user.id })

			if(! service)
				return response.status(400)

			return response.render('success.pug', {
				service, message: 'Serviço cadastrado com sucesso!'
			})
		})
	}

	@Router.Get('/:id')
	static async find({ params }, response)
	{
		const user = await $Service.findOne({
			where: { id: params.id },
			attributes: { exclude: ['password', 'CPF'] }
		})

		return response.status(200).json({
			payload: user
		})
	}
}
