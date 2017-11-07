/**
 * @Authors: Matheus Reis <matheusdrdj@gmail.com>
 *           Raphael Nepomuceno <raphael.nepomuceno@ufv.br>
 * @Date:   2017-11-06
 */

import Sequelize from 'sequelize'
import { SCHEMA_URI } from '../settings.js'

const sequelize = new Sequelize(SCHEMA_URI, {
	logging: false,
	define: { timestamps: false }
})

const $Address        = sequelize.import(__dirname + '/address.js')
const $Contract       = sequelize.import(__dirname + '/contract.js')
const $CreditCard     = sequelize.import(__dirname + '/creditCard.js')
const $ServiceOffer   = sequelize.import(__dirname + '/serviceOffer.js')
const $Phone          = sequelize.import(__dirname + '/phone.js')
const $Review         = sequelize.import(__dirname + '/review.js')
const $ServiceType    = sequelize.import(__dirname + '/serviceType.js')
const $User           = sequelize.import(__dirname + '/user.js')

$Address.hasMany($Contract)
$Address.hasMany($CreditCard)

$Contract.hasMany($Review)

$CreditCard.hasMany($Contract)

$ServiceOffer.hasMany($Contract)

$Review.belongsTo($User, { as: 'receiver' })
$Review.belongsTo($User, { as: 'sender' })

$ServiceType.hasMany($ServiceOffer)

$User.hasMany($Address)
$User.hasMany($ServiceOffer)
$User.hasMany($Contract)
$User.hasMany($CreditCard)
$User.hasMany($Phone)

sequelize.sync({ force: true })

export {
	sequelize,
	$Address, $Contract, $CreditCard, $Phone,
	$Review, $ServiceOffer, $ServiceType, $User
}
