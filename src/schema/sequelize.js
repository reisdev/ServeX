/**
 * @Author: Matheus Reis <matheusdrdj@gmail.com
 * @Date:   2017-11-06
 */

import Sequelize from 'sequelize'
import { SCHEMA_URI } from '../settings.js'

const sequelize = new Sequelize(SCHEMA_URI, {
    logging: console.log
})

const $Users = sequelize.import(__dirname + '/users.js')
const $Review = sequelize.import(__dirname + '/review.js')
const $Contract = sequelize.import(__dirname + '/contract.js')
// const $ServiceType = sequelize.import(__dirname + '/servicetype.js')
// const $OfferedService = sequelize.import(__dirname + '/offeredservice.js')
// const $Adress = sequelize.import(__dirname + '/adress.js')
// const $CredCard = sequelize.import(__dirname + '/credcard.js')
// const $Phone = sequelize.import(__dirname + '/phone.js')

$Review.belongsTo($Contract)

$Contract.hasOne($Review,{ as: "Hirer"})
$Contract.hasOne($Review,{ as: "Hired"})

sequelize.sync({ force: true })
export {
    sequelize,
    $Users,
    $Review,
    $Contract,
    // $ServiceType,
    // $OfferedService,
    // $Adress,
    // $CredCard,
    // $Phone
}
