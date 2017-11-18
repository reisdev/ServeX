/**
 * @Authors: Matheus Reis <matheusdrdj@gmail.com>
 *           Raphael Nepomuceno <raphael.nepomuceno@ufv.br>
 * @Date:   2017-11-06
 */

import path from 'path'
import bcrypt from 'bcrypt'

import Sequelize from 'sequelize'
import { SCHEMA_URI } from './settings.js'

const sequelize = new Sequelize(SCHEMA_URI, {
	logging: false,
	define: { timestamps: false }
})

const $Address          = sequelize.import(path.join(__dirname, 'schema/address.js'))
const $Contract         = sequelize.import(path.join(__dirname, 'schema/contract.js'))
const $CreditCard       = sequelize.import(path.join(__dirname, 'schema/creditCard.js'))
const $Service          = sequelize.import(path.join(__dirname, 'schema/serviceOffer.js'))
const $Phone            = sequelize.import(path.join(__dirname, 'schema/phone.js'))
const $Review           = sequelize.import(path.join(__dirname, 'schema/review.js'))
const $ServiceCategory  = sequelize.import(path.join(__dirname, 'schema/serviceType.js'))
const $User             = sequelize.import(path.join(__dirname, 'schema/user.js'))

$Address.hasMany($Contract)
$Address.hasMany($CreditCard)

$Contract.hasMany($Review)

$CreditCard.hasMany($Contract)

$Review.belongsTo($User, { as: 'receiver' })
$Review.belongsTo($User, { as: 'sender' })

$Service.hasMany($Contract)

$ServiceCategory.hasMany($Service)

$User.hasMany($Address)
$User.hasMany($Contract)
$User.hasMany($CreditCard)
$User.hasMany($Phone)
$User.hasMany($Service)

sequelize.sync({ force: false })

export {
	sequelize, Sequelize,
	$Address, $Contract, $CreditCard, $Phone,
	$Review, $Service, $ServiceCategory, $User
}
