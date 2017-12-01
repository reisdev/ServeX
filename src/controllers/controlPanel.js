/* @Author: Raphael Nepomuceno <raphael.nepomuceno@ufv.br> */

import _ from 'lodash'
import moment from 'moment'

import * as Router from '../utils/router.js'
import * as Middlewares from '../utils/middlewares.js'
import * as Utils from '../utils/utils.js'

import { Op as $ } from 'sequelize'
import Sequelize from 'sequelize'

import {
	$Address,
	$Contract,
	$Review,
	$Service,
	$ServiceCategory,
	$User,
	sequelize,
} from '../sequelize.js'

export const translatePricing = (type) => {
	switch (type)
	{
		case 'Daily':  return 'dia(s)'
		case 'Hourly': return 'hora(s)'
		case 'Once':   return 'serviço'
	}
}

@Router.Route('/cpanel', [
	Middlewares.restrictedPage({ message: 'Área restrita a usuários cadastrados.' })
])
export class ControlPanel
{
	static stopgap (title, message, links = [])
	{
		return (response) => response.render('controlPanel/stopgap.pug', {
			title,
			message,
			links: [
				... links,
				{ to: '/cpanel', title: 'Panel administrativo' },
				{ to: '/cpanel/pending', title: 'Serviços pendentes' },
			]
		})
	}

	@Router.Get('/')
	static async index ({ session }, response)
	{
		return response.render('controlPanel/index.pug')
	}

	@Router.Get('/pending')
	static async pending ({ params, session }, response)
	{
		const services = await $Service.findAll({
			where: { userId: session.user.id },
			include: [
				$ServiceCategory,
				{
					model: $Contract,
					where: { pending: true },
					include: [ $User, $Address ]
				}
			]
		})

		return response.render('controlPanel/pending.pug', { moment, services, translatePricing })
	}

	@Router.Get('/active')
	static async active ({ params, session }, response)
	{
		const services = await $Service.findAll({
			where: { userId: session.user.id },
			include: [
				$ServiceCategory,
				{
					model: $Contract,
					where: { completed: false, accepted: true },
					include: [ $User, $Address ]
				}
			]
		})

		return response.render('controlPanel/active.pug', { moment, services, translatePricing })
	}

	@Router.Get('/history')
	static async history ({ params, session }, response)
	{
		const services = await $Service.findAll({
			where: {
				[$.or]: [
					{ 'userId': session.user.id },
					Sequelize.where(sequelize.col('contracts.userId'), session.user.id)
				]
			},
			include: [
				$ServiceCategory,
				$User,
				{
					model: $Contract,
					where: { completed: true },
					include: [
						$User,
						$Address,
						{
							model: $Review,
							include: [{ model: $User, as: 'sender' }],
							required: false
						}
					]
				}
			],
			order: [[ sequelize.col('contracts.accepted'), 'DESC' ]]
		})

		return response.render('controlPanel/history.pug', {
			moment, services, translatePricing, _
		})
	}

	@Router.Post('/rate')
	static async rate ({ body, session }, response)
	{
		await sequelize.transaction(async (transaction) => {
			const contract = await $Contract.findOne({
				transaction,
				where: {
					id: body.contractId,
					[$.or]: [
						{ 'userId': session.user.id },
						Sequelize.where(sequelize.col('service.userId'), session.user.id)
					]
				},
				include: [{ model: $Service }]
			})

			const review = await $Review.create({
				contractId: contract.id,
				message: body.message,
				senderId: session.user.id,
				rating: body.score,
				receiverId: contract.userId === session.user.id
					? contract.service.userId
					: contract.userId
			}, { transaction })

			return response.json({ contract, body, review })
		})
	}

	@Router.Get('/pending/:type(accept|refuse)/:id')
	static async accept ({ params, session }, response)
	{
		const accepted = params.type === 'accept'

		await sequelize.transaction(async (transaction) => {
			const contract = await $Contract.findOne({
				transaction,
				where: { pending: true, id: params.id },
				include: [ { model: $Service, userId: session.user.id } ]
			})

			if (! contract)
				return ControlPanel.stopgap(`Operação inválida.`)(response)

			const p = accepted
				? { pending: false, accepted: true,  completed: false }
				: { pending: false, accepted: false, completed: true  }

			await contract.update(p, { transaction })
			return ControlPanel.stopgap(`Contrato ${accepted ? 'aceito' : 'recusado'}.`)(response)
		})
	}

	@Router.Get('/active/complete/:id')
	static async complete ({ params, session }, response)
	{
		await sequelize.transaction(async (transaction) => {
			const contract = await $Contract.findOne({
				transaction,
				where: { accepted: true, id: params.id },
				include: [ { model: $Service, userId: session.user.id } ]
			})

			if (! contract)
				return ControlPanel.stopgap(`Operação inválida.`)(response)

			await contract.update({ completed: true }, { transaction })
			return ControlPanel.stopgap('Serviço concluído.')(response)
		})
	}
}
