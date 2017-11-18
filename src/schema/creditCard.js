/**
 * @Authors: Matheus Reis <matheusdrdj@gmail.com>
 *           Raphael Nepomuceno <raphael.nepomuceno@ufv.br>
 * @Date:   2017-11-06
 */

export default function (sequelize, DataTypes)
{
	const CreditCard = sequelize.define('creditCard', {
		id: {
			type: DataTypes.UUID,
	        primaryKey: true,
	        defaultValue: DataTypes.UUIDV4
		},
		cardNumber: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: 'cardNumberCVC'
		},
		validUntil: {
			type: DataTypes.DATE,
			allowNull: false
		},
		CVC: {
			type: DataTypes.INTEGER,
			allowNull: false,
			unique: 'cardNumberCVC'
		}
	})

	return CreditCard
}
