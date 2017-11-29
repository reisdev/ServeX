/**
 * @Authors: Matheus Reis <matheusdrdj@gmail.com>
 *           Raphael Nepomuceno <raphael.nepomuceno@ufv.br>
 */

import path from 'path'
import bcrypt from 'bcrypt'

import Sequelize from 'sequelize'
import { schema, forceRebuild } from './settings.js'

const sequelize = new Sequelize(... schema)

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
$Contract.belongsTo($User)

$CreditCard.hasMany($Contract)

$Review.belongsTo($User, { as: 'receiver' })
$Review.belongsTo($User, { as: 'sender' })

$Service.hasMany($Contract)

$Service.belongsTo($ServiceCategory)
$Service.belongsTo($User)

$User.hasMany($Address)
$User.hasMany($CreditCard)
$User.hasMany($Phone)

sequelize.sync({ force: forceRebuild || false })

$Review.afterCreate(review => {
	sequelize.transaction(async (transaction) => {
		const sql = `SELECT
			1.0 * (:confidence * :alpha + SUM(rating)) / (:confidence + COUNT(*)) AS normalizedScore,
			COUNT(*) AS ratingCount
			FROM reviews WHERE receiverId = :id`

		const rank = await sequelize.query(sql, {
			transaction,
			type: sequelize.QueryTypes.SELECT,
			replacements: {
				id: params.id,
				// Represents a prior for the average of the stars.
				alpha: 2.5,
				// Represents how confident we're in our prior.
				// It is equivalent to a number of observations.
				confidence: 5.0
			}
		})

		return $User.update({
			rating: rank.normalizedScore,
			ratingCount: rank.ratingCount
		}, {
			transaction,
			where: { id: review.receiverId }
		}).catch(() => {})
	})
})

export {
	sequelize, Sequelize,
	$Address, $Contract, $CreditCard, $Phone,
	$Review, $Service, $ServiceCategory, $User
}
