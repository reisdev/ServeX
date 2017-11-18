/**
 * @Authors: Matheus Reis <matheusdrdj@gmail.com>
 *           Raphael Nepomuceno <raphael.nepomuceno@ufv.br>
 * @Date:   2017-11-06
 */

export default function (sequelize, DataTypes)
{
	const ServiceCategory = sequelize.define('serviceCategory', {
		id: {
			primaryKey:    true,
			type:          DataTypes.UUID,
			defaultValue:  DataTypes.UUIDV4
		},
		name:        { allowNull: false, type: DataTypes.STRING, unique: true },
		pricingType: { allowNull: false, type: DataTypes.ENUM('Once', 'Hourly', 'Daily') }
	})

	return ServiceCategory
}
