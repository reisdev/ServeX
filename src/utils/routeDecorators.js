/**
 * @Author: Raphael Nepomuceno <raphael.nepomuceno@ufv.br>
 * @Date:   2017-11-07
 */

import path from 'path'

export function Router ({ route = '/', middlewares = [] })
{
	return function (target, name, descriptor)
	{
		target.registerRoutes = (app) =>
		{
			target.__routes.forEach(r => r(route, app, middlewares))
		}
	}
}

function httpMethod (method, route, middlewares = [])
{
	return function (target, name, descriptor)
	{
		if(! target.__routes)
			target.__routes = []

		if(! route)
			route = typeof route === 'string' ? '' : name

		target.__routes.push((r, a, m) => {
			a[method](path.join(r, route), ... m, ... middlewares, descriptor.value)
		})

		return descriptor
	}
}

export function MuteExceptions(target, name, descriptor)
{
	const original = descriptor.value
	descriptor.value = async (req, res, next) => {
		try {
			return await original.call(this, req, res, next)
		} catch (e) {
			return res.status(500).end()
		}
	}

	return descriptor
}

export function Get (route, middlewares = [])
{
	return httpMethod('get', route, middlewares)
}

export function Post (route, middlewares = [])
{
	return httpMethod('post', route, middlewares)
}
