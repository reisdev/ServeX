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

export function GET (route, middlewares = [])
{
	return httpMethod('get', route, middlewares)
}

export function POST (route, middlewares = [])
{
	return httpMethod('post', route, middlewares)
}

export function JSONEndpoint(target, name, descriptor)
{
	const original = descriptor.value
	descriptor.value = async (req, res, next) => {
		try {
			const out = original.call(this, req)
			return res.status(await out.status || 200).json(await out)
		} catch (e) {
			return next(e)
		}
	}

	return descriptor
}
