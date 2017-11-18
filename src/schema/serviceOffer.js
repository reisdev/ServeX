/**
 * @Authors: Matheus Reis <matheusdrdj@gmail.com>
 *           Raphael Nepomuceno <raphael.nepomuceno@ufv.br>
 * @Date:   2017-11-06
 */

export default function (sequelize, DataTypes)
{
	const Service = sequelize.define('service', {
		id: {
			primaryKey:    true,
			type:          DataTypes.UUID,
			defaultValue:  DataTypes.UUIDV4
		},
		title:        DataTypes.STRING,
		description:  DataTypes.STRING,
		basePrice:    DataTypes.DECIMAL(10, 2)
	})

	return Service
}
