/* @Author: Matheus Reis <matheus.r.jesus@ufv.br */

import _ from 'lodash'

import { provinces } from '../settings'
import * as Router from '../utils/router.js'
import * as Middlewares from '../utils/middlewares.js'
import { $Address, $User, sequelize } from '../sequelize.js'

@Router.Route('/address')

export class Address {

    @Router.Get('/')
    static async getAddresses(request, response){
        const addresses = await $Address.findAll({
           attributes: ['id','street']
        })
        return response.status(200).json(addresses)
    }

    @Router.Post('/add', [
        Middlewares.restrictedPage({
            message: 'Efetue login para adicionar um endereço.'
        })
    ])
    static async insert({body, session}, response) {
        await sequelize.transaction( async(transaction) => {
            try {
                const newAddress = await $Address.create({
                    ...body,
                    userId: session.user.id
                },{transaction})

                const user = await $User.findOne({
                    where: { id: session.user.id }
                })
                
                const addresses = await $Address.findAll({
                    where: { userId: session.user.id }
                })

                response.status(200).render('user.pug',{
                    user,
                    addresses,
                    provinces,
                    success: ['Endereço inserido com sucesso']
                })
            } catch(e){
                response.status(400).render('error.pug',{
                    error: 'Não foi possível inserir novo endereço',
                    message: 'Entre em contato com o suporte',
                    stack: e.stack
                })
                }
            })
    }

    @Router.Get('/get/:id')
    static async getAddresses({ params }, response){
        const addresses = await $Address.findAll({
           where: { id: params.id }
        })
        return response.status(200).json(addresses)
    }

    @Router.Post('/remove')
    static async removeAddress({ body, session}, response) {
        console.log(body)
        await sequelize.transaction( async(transaction)=>{
            try {
                const user = await $User.findOne({
                    where: {
                        id: session.user.id
                    }
                })
                const removed = await $Address.destroy({
                    where: {
                        id: body.id,
                        userId: session.user.id
                    }
                })
                const addresses = await $Address.findAll({
                    where:{
                        userId: user.id
                    }
                })
                response.status(200).render('user.pug',{
                    user,
                    addresses,
                    provinces,
                    success: ['Endereço removido com sucesso']
                })
            } catch(e) {
                response.status(400).render('error.pug',{
                    error: 'Problema ao apagar endereço',
                    message: 'Erro desconhecido',
                    stack: e.stack
                })
            }
        })
    }
}