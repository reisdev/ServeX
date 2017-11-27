/* @Author: Raphael Nepomuceno <raphael.nepomuceno@ufv.br> */

import * as Router from '../utils/router.js'
import * as Middlewares from '../utils/middlewares.js'

import { $Service, $ServiceCategory, $User, $Contract, sequelize } from '../sequelize.js'

const mapPricingType = (type) => {
	switch (type)
	{
		case 'Daily':  return 'por dia'
		case 'Hourly': return 'por hora'
		case 'Once':   return 'único'
	}
}

@Router.Route({ route: '/services' })
export class Service
{
	@Router.Get('/') @Router.Get('../')
	static async index(request, response)
	{
		const services = $Service.findAll({
			raw: true,
			include: [ $ServiceCategory, $User ],
			order: [[ 'addedDate', 'DESC' ]]
		})

		const categories = $ServiceCategory.findAll({ raw: true })

		return response.render('services.pug', {
			services: await services,
			categories: await categories,
			mapPricingType
		})
	}

	@Router.Get('/pending')
	static async pendingContract({ params, session }, response)
	{
		try {
			return response.json(await $Service.findAll({
				where: {
					userId: session.user.id
				},
				include: [
					{ model: $Contract, where: { pending: true } }
				]
			}))
		} catch (e) {
			return response.status(400).render('error.pug', {
				status: '0x07',
				error: 'Erro',
				message: 'Erro.',
				stack: e.stack
			})
		}
	}

	@Router.Get('/contract/:id')
	static async contract({ params, session }, response)
	{
		return await sequelize.transaction(async (transaction) => {
			try {
				const service = await $Service.findOne(
					{
						where: { id: params.id },
						include: [ $ServiceCategory, $User ]
					},
					{ transaction }
				)

				try {
					const contract = await $Contract.create({
						serviceId: service.id,
						userId: session.user.id,
						totalPrice: service.basePrice * 5,
						peding: true,
						completed: false,
						accepted: false
					})

					return response.status(200).json(contract)
				} catch (e) {
					return response.status(400).render('error.pug', {
						status: '0x04',
						error: 'Erro ao contratar serviço',
						message: 'Erro desconhecido.',
						stack: e.stack
					})
				}
			} catch (e) {
				return response.status(400).render('error.pug', {
					status: '0x03',
					error: 'Erro ao contratar serviço',
					message: 'Serviço inexistente.',
					stack: e.stack
				})
			}
		})
	}

	@Router.Get('/filter/:id')
	static async filter({ params }, response, next)
	{
		const serviceCategoryId = {}
		const pricingType = {}

		switch(params.id)
		{
			case 'hourly': pricingType.pricingType = 'Hourly'; break
			case 'daily': pricingType.pricingType = 'Daily'; break
			case 'once': pricingType.pricingType = 'Once'; break
			default: serviceCategoryId.serviceCategoryId = params.id
		}

		const services = $Service.findAll({
			raw: true,
			where: serviceCategoryId,
			order: [[ 'basePrice', 'DESC' ]],
			include: [
				{ model: $ServiceCategory, where: pricingType },
				$User
			]
		})

		const categories = $ServiceCategory.findAll({
			raw: true
		})

		return response.render('services.pug', {
			services: await services,
			categories: await categories,
			mapPricingType
		})
	}

	@Router.Get('/add', [
		Middlewares.restrictedPage({
			message: 'Efetue login para adicionar um serviço.'
		})
	])
	static async insertForm (request, response)
	{
		const categories = $ServiceCategory.findAll({ raw: true })

		return response.render('addService.pug', {
			categories: await categories,
			mapPricingType
		})
	}

	@Router.Post('/', [
		Middlewares.restrictedPage({ message: 'Efetue login para adicionar um serviço.' })
	])
	static async doInsert ({ body, session }, response)
	{
		return await sequelize.transaction(async (transaction) => {
			try {
				const category = await $ServiceCategory.findOne({
					where: { id: body.serviceCategoryId }
				}, { transaction })

				try {
					const service = await $Service.create({
						... body,
						serviceCategoryId: category.id,
						userId: session.user.id,
						addedDate: new Date
					})

					return response.render('success.pug', {
						service, message: 'Serviço cadastrado com sucesso!'
					})
				} catch(e) {
					return response.status(400).render('error.pug', {
						status: '0x01',
						error: 'Erro ao cadastrar serviço',
						message: 'Por algum motivo desconhecido, não foi possível cadastrar o serviço.',
						stack: e.stack
					})
				}
			} catch(e) {
				return response.status(400).render('error.pug', {
					status: '0x00',
					error: 'Categoria inválida',
					message: 'A categoria escolhida não existe.',
					stack: e.stack
				})
			}
		})
	}

	@Router.Get('/:id')
	static async find({ params }, response)
	{
		try {
			const categories = $Service.findOne({
				raw: true,
				where: { id: params.id },
				include: [ $ServiceCategory, $User ]
			})

			return response.render('viewService.pug', { service: await categories, mapPricingType })
		} catch (e) {
			return response.status(400).render('error.pug', {
				status: '0xF00',
				error: 'Serviço inexistente',
				message: 'O serviço solicitado não existe.',
				stack: e.stack
			})
		}
	}
}
