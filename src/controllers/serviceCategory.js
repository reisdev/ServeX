/*! @Author: Matheus Reis <matheus.r.jesus@ufv.br */

import * as Router from '../utils/router.js'

import {
    $ServiceCategory,
    sequelize
} from '../sequelize.js'

@Router.Route({
    route: '/categories'
})

export class ServiceCategory {
    @Router.Get('/')
    static async getCategories(request, response) {
        const Categories = $ServiceCategory.findAll()
        return response.status(200).json({
            payload: await Categories
        })
    }

    @Router.Get('/add')
    static async addCategories(request, response) {
        return response.status(200).render('success.pug',{
            message: 'Categoria Criada!'
        })
    }

    @Router.Post('/')
    static async insertCategory({
        body
    }, response) {
        const category = await $ServiceCategory.create({
            name: body.name,
            pricingType: body.pricingType
        })
        response.status(200).render('services.pug')
    }

    @Router.Get('/:id')
    static async find({
        params
    }, response) {
        const user = await $ServiceCategory.findOne({
            where: {
                id: params.id
            },
        })
        return response.status(200).render('services.pug')
    }
}