/**
 * @Author: Raphael Nepomuceno <raphael.nepomuceno@ufv.br>
 * @Date:   2017-11-07
 */

import { Router, Get, Post, MuteExceptions } from '../utils/routeDecorators.js'

export * from './services.js'
export * from './user.js'

@Router({ route: '/' })
export class Index
{
	@Get('/')
	static async index (request, response)
	{
		return response.render('index.pug', { message: 'Hello world!' })
	}
}
