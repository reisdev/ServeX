/*! @Author: Raphael Nepomuceno <raphael.nepomuceno@ufv.br> */

import * as Router from '../utils/router.js'
import * as Middlewares from '../utils/middlewares.js'

import { $Address, $User } from '../sequelize.js'

@Router.Route('/user/profile', [
	Middlewares.restrictedPage({ message: 'Área restrita a usuários cadastrados.' })
])
export class UserProfile
{
	@Router.Get('/')
	@Router.Get('/:id')
	static async viewUser({ params, session }, response)
	{
		const user = await $User.findOne({
			where: { id: params.id || session.user.id },
			include: [{ model: $Address, where: { enabled: true } }]
		})

		if(! user)
			return response.status(404).render('error.pug', {
				error: 'Usuário não encontrado',
				message: 'O usuário solicitado não foi encontrando em nossa base de dados'
			})

		return response.render('user/profile.pug', { viewUser: user })
	}
}
