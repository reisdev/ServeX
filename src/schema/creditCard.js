/**
 * @Authors: Matheus Reis <matheusdrdj@gmail.com>
 *           Raphael Nepomuceno <raphael.nepomuceno@ufv.br>
 * @Date:   2017-11-06
 */

export default function (sequelize, DataTypes)
{
	const CreditCard = sequelize.define('creditCard', {
		id: {
			primaryKey:    true,
			type:          DataTypes.UUID,
			defaultValue:  DataTypes.UUIDV4
		},
		cardNumber: { type: DataTypes.STRING,  allowNull: false, unique: 'cardNumberCVC' },
		CVC:        { type: DataTypes.INTEGER, allowNull: false, unique: 'cardNumberCVC' },
		validUntil: { type: DataTypes.DATE,    allowNull: false },
	})

	return CreditCard
}
