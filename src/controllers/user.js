/**
 * @Author: Raphael Nepomuceno <raphael.nepomuceno@ufv.br>
 * @Date:   2017-11-07
 */

import { Router, Get, Post, MuteExceptions } from '../utils/routeDecorators.js'
import { $User, $Address } from '../sequelize.js'

import _ from 'lodash'

@Router({ route: '/user' })
export class User
{
	@Get('/') @MuteExceptions
	static async profile (request, response)
	{
		return response.status(200).json({
			payload: await $User.findAll({ attributes: { exclude: ['password', 'CPF'] } })
		})
	}

	@Get('/signup')
	@Post('/signup')
	static async signup (request, response)
	{
		if(_.isEmpty(request.body))
			return response.render('signup.pug', { errors: {} })

		try {
			const u = await $User.create(request.body)
			const p = await $Address.create({
				... request.body, userId: u.id
			})
			console.log(u, p)
			//return response.location('/')
			return response.render('signup.pug')
		} catch (e) {
			if(e.name !== 'SequelizeUniqueConstraintError' && e.name !== 'SequelizeValidationError')
				throw e

				console.log(e)
				console.log(request.body)

			const errors = e.errors.reduce(
				(hash, p) => { hash[p.path] = p.validatorKey; return hash },
				{}
			)

			return response.status(400).render('signup.pug', { errors })
		}
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
