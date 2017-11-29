/**
* @Authors: Matheus Reis <matheusdrdj@gmail.com>
*           Raphael Nepomuceno <raphael.nepomuceno@ufv.br>
* @Date:   2017-11-06
*/

export default function (sequelize, DataTypes)
{
	const Contract = sequelize.define('contract', {
		id: {
			primaryKey:    true,
			type:          DataTypes.UUID,
			defaultValue:  DataTypes.UUIDV4
		},
		totalPrice:  { type: DataTypes.DECIMAL(10, 2), allowNull: false },
		accepted:    { type: DataTypes.BOOLEAN, defaultValue: false },
		completed:   { type: DataTypes.BOOLEAN, defaultValue: false },
		pending:     { type: DataTypes.BOOLEAN, defaultValue: true  },
		startDate:           DataTypes.DATE,
		endDate:             DataTypes.DATE,
		expectedDuration:    DataTypes.FLOAT,
		message:             DataTypes.TEXT,
	})

	return Contract
}
