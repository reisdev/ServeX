/**
 * @Author: Raphael Nepomuceno <raphael.nepomuceno@ufv.br>
 * @Date:   2017-11-07
 */

import { Router, JSONEndpoint, GET, POST } from '../utils/routeDecorators.js'
import { $User } from '../sequelize.js'

@Router({ route: '/user' })
export class UserEndpoint
{
	@GET('') @JSONEndpoint
	static async profile (req)
	{
		return {
			success: true,
			status: 200,
			payload: await $User.findAll()
		}
	}

	@GET('/:id') @JSONEndpoint
	static async getProductById(req)
	{
		return {
			success: true,
			status: 200,
			payload: await $User.find({ where: { id: req.params.id } })
		}
	}
}
