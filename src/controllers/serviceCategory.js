/*! @Author: Matheus Reis <matheus.r.jesus@ufv.br */

import * as Router from '../utils/router.js'

import { $ServiceCategory, sequelize } from '../sequelize.js'

@Router.Route({ route: '/categories' })
export class ServiceCategory
{
    @Router.Get('/')
    static async getCategories(request, response)
	{
		const categories = $ServiceCategory.findAll()
        return response.json({
            payload: await categories
        })
    }

    @Router.Get('/add')
    static async addCategories(request, response)
	{
        return response.render('addCategory.pug')
    }

    @Router.Post('/')
    static async insertCategory({ body }, response)
	{
        console.log('Inserindo')

        const category = await $ServiceCategory.create({
            name: body.name,
            pricingType: body.pricingType
        })

        response.render('services.pug')
    }

    @Router.Get('/:id')
    static async find({ params }, response)
	{
        const user = await $ServiceCategory.findOne({
            where: { id: params.id },
        })

        return response.render('services.pug')
    }
}
