/* @Author: Matheus Reis <matheus.r.jesus@ufv.br */

import _ from 'lodash'

import { provinces } from '../settings'
import * as Router from '../utils/router.js'
import * as Middlewares from '../utils/middlewares.js'
import { $Address, $User, sequelize } from '../sequelize.js'

@Router.Route('/address', [
	Middlewares.restrictedPage({ message: 'Área restrita a usuários cadastrados.' })
])
export class Address
{
	@Router.Post('/add')
	static async add ({ body, session }, response)
	{
		try {
			const address = $Address.create({ ... body, userId: session.user.id })

			session.save(err => response.redirect(`/user/profile/${session.user.id}`))
		} catch (e) {
			return response.render('error.pug', {
				error: 'Não foi possível inserir novo endereço',
				message: 'Entre em contato com o suporte',
				stack: e.stack
			})
		}
	}

	@Router.Post('/remove')
	static async remove ({ body, session }, response)
	{
		await $Address.update(
			{ enabled: false },
			{ where: { id: body.id, userId: session.user.id } }
		)

		session.save(err => response.redirect(`/user/profile/${session.user.id}`))
	}
}
