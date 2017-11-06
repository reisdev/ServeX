/**
 * @Author: Matheus Reis <matheusdrdj@gmail.com
 * @Date:   2017-11-06
 */

import Sequelize from 'sequelize'
import settings from '../settings.js'
  
export default (seq,DataTypes) =>
    seq.define (
        'contract',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            totalPrice: {
                type: DataTypes.DECIMAL(10,2),
                allowNull: false
            }
        }
    )