/* @Author: Raphael Nepomuceno <raphael.nepomuceno@ufv.br> */

import _ from 'lodash'
import moment from 'moment'

import * as Router from '../utils/router.js'
import * as Middlewares from '../utils/middlewares.js'
import * as Utils from '../utils/utils.js'

import { $Address, $Service, $ServiceCategory, $User, $Contract, sequelize } from '../sequelize.js'

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
	static stopgap(title, message, links)
	{
		return (response) => response.render('controlPanel/stopgap.pug', { title, message, links })
	}

	@Router.Get('/')
	static async main({ session }, response){
		const pendingCount = await $Service.count({
			where: { userId: session.user.id },
			include: [
				$ServiceCategory,
				{ model: $Contract, where: { pending: true }, include: [ $User ] }
			]
		})

		return response.status(200).render('controlPanel/index.pug', { pendingCount })
	}

	@Router.Get('/pending')
	static async pending ({ params, session }, response)
	{
		const services = await $Service.findAll({
			where: { userId: session.user.id },
			include: [
				$ServiceCategory,
				{ model: $Contract, where: { pending: true }, include: [ $User, $Address ] }
			]
		})

		return response.render('controlPanel/pending.pug', {
			moment,
			services,
			translatePricing
		})
	}

	@Router.Get('/pending/:type(accept|refuse)/:id')
	static async accept ({ params, session }, response)
	{
		const isAccept = params.type === 'accept'

		await sequelize.transaction(async (transaction) => {
			const contract = await $Contract.findOne({
				transaction,
				where: { pending: true, id: params.id },
				include: [
					{
						model: $Service,
						include: [
							{ model: $User, where: { id: session.user.id } }
						]
					}
				]
			})

			if (! contract)
				return ControlPanel.stopgap(`Operação inválida.`, null, [
					{ to: '/cpanel', title: 'Panel administrativo' },
					{ to: '/cpanel/pending', title: 'Serviços pendentes' }
				])(response)

			const p = isAccept
				? { pending: false, accepted: true,  completed: false }
				: { pending: false, accepted: false, completed: true  }

			await contract.update(p, { transaction })
			return response.redirect(`/cpanel/pending/${isAccept ? 'accepted' : 'refused'}`)
		})
	}

	@Router.Get('/pending/:type(accepted|refused)')
	static accepted ({ params }, response)
	{
		return ControlPanel.stopgap(
			params.type === 'accepted' ? 'Contrato aceito.' : 'Contrato recusado.',
			null,
			[
				{ to: '/cpanel', title: 'Panel administrativo' },
				{ to: '/cpanel/pending', title: 'Serviços pendentes' }
			]
		)(response)
	}
}
