/**
 * @Author: Matheus Reis <matheusdrdj@gmail.com
 * @Date:   2017-11-06
 */

import Sequelize from 'sequelize'
import { SCHEMA_URI } from '../settings.js'

const sequelize = new Sequelize(SCHEMA_URI)

const $User = sequelize.import(__dirname + '/users.js')
const $Review = sequelize.import(__dirname + '/review.js')
const $Contract = sequelize.import(__dirname + '/contract.js')
const $ServiceType = sequelize.import(__dirname + '/servicetype.js')
const $OfferedService = sequelize.import(__dirname + '/offeredservice.js')
const $Adress = sequelize.import(__dirname + '/adress.js')
// const $CredCard = sequelize.import(__dirname + '/credcard.js')
// const $Phone = sequelize.import(__dirname + '/phone.js')

$User.hasMany($Adress)

$Review.belongsTo($User, { as: 'reviewer' })
$Review.belongsTo($User, { as: 'reviewed' })

$Contract.hasMany($Review)

$OfferedService.hasMany($Contract)
$OfferedService.belongsTo($ServiceType, { as: 'servicetype' })

$Adress.hasMany($Contract)

sequelize.sync({ force: true })

export {
    sequelize,
    $User,
    $Review,
    $Contract,
    $ServiceType,
    // $OfferedService,
    // $Adress,
    // $CredCard,
    // $Phone
}
