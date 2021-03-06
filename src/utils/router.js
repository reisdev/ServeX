/**
 * @Author: Raphael Nepomuceno <raphael.nepomuceno@ufv.br>
 * @Date:   2017-11-07
 */

import { posix as path } from 'path'

export function Route (route = '/', middlewares = [])
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

export function Get (route, middlewares = [])
{
	return httpMethod('get', route, middlewares)
}

export function Post (route, middlewares = [])
{
	return httpMethod('post', route, middlewares)
}

export function All (route, middlewares = [])
{
	return httpMethod('all', route, middlewares)
}
