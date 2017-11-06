/**
 * @Author: Matheus Reis <matheusdrdj@gmail.com
 * @Date:   2017-11-06
 */

 export default ( seq, DataTypes ) => seq.define('offeredservice',{
        id :{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: DataTypes.STRING,
        description: DataTypes.STRING,
        baseprice: DataTypes.DECIMAL(10, 2)
 })