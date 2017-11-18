/**
 * @Author: Raphael Nepomuceno <raphael.nepomuceno@ufv.br>
 * @Date:   2017-11-07
 */

import { Router, Get, Post, MuteExceptions } from '../utils/routeDecorators.js'
import { $User } from '../sequelize.js'

@Router({ route: '/user' })
export class UserEndpoint
{
	@Get('/') @MuteExceptions
	static async profile (request, response)
	{
		return response.status(200).json({
			payload: await $User.findAll({ attributes: { exclude: ['password', 'CPF'] } })
		})
	}

	@Post('/') @MuteExceptions
	static async insert (request, response)
	{
		const u = await $User.create({
			email: request.body.email,
			password: request.body.password,
			CPF: request.body.CPF,
			fullName: request.body.fullName
		})

		return response.status(200).json({ payload: { id: u.id } })
	}

	@Get('/:id') @MuteExceptions
	static async find ({ params }, response)
	{
		const user = await $User.findOne({
			where: { id: params.id },
			attributes: {
				exclude: ['password', 'CPF']
			}
		})

		return response.status(200).json({ payload: user })
	}
}
