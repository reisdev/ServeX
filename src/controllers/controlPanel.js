/* @Author: Raphael Nepomuceno <raphael.nepomuceno@ufv.br> */

import _ from 'lodash'
import moment from 'moment'

import * as Router from '../utils/router.js'
import * as Middlewares from '../utils/middlewares.js'
import * as Utils from '../utils/utils.js'

import { $Service, $ServiceCategory, $User, $Contract, sequelize } from '../sequelize.js'

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
	@Router.Get('/')
	static async main({ session }, response){
		const pendings = await $Service.count({
			where: {userId: session.user.id },
			include: [
				$ServiceCategory,
				{ model: $Contract, where: { pending: true }, include: [$User]}
			]
		})
		return response.status(200).render('controlPanel/main.pug', {
			pendings: pendings
		})
	}

	@Router.Get('/pending')
	static async pending ({ params, session }, response)
	{
		const service = await $Service.findAll({
			where: { userId: session.user.id },
			include: [
				$ServiceCategory,
				{ model: $Contract, where: { pending: true }, include: [ $User ] }
			]
		})
		console.log(service)
		return response.render('controlPanel/pending.pug', {
			moment,
			translatePricing,
			service: service
		})
	}
}
