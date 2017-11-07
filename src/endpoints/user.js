/**
 * @Author: Raphael Nepomuceno <raphael.nepomuceno@ufv.br>
 * @Date:   2017-11-07
 */

import { Router, GET, POST } from '../utils/routeDecorators.js'

@Router({ route: '/user' })
export class UserEndpoint
{
	@GET()
	@POST()
	static async profile (req, res)
	{
		return res.status(200).json([ req.body ])
	}
}
