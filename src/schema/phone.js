/**
 * @Authors: Matheus Reis <matheusdrdj@gmail.com>
 *           Raphael Nepomuceno <raphael.nepomuceno@ufv.br>
 * @Date:   2017-11-06
 */

export default function (sequelize, DataTypes)
{
	const Phone = sequelize.define('phone', {
		id: {
			primaryKey:    true,
			type:          DataTypes.UUID,
			defaultValue:  DataTypes.UUIDV4
		},
		name:    { type: DataTypes.STRING, allowNull: false },
		number:  { type: DataTypes.STRING, allowNull: false },
	})

	return Phone
}
