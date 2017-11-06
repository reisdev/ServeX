/**
 * @Author: Matheus Reis <matheusdrdj@gmail.com>
 * @Date:   2017-11-06
 */

export default (seq, DataTypes) => seq.define('servicetypes', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })