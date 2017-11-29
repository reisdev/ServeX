/**
* @Authors: Matheus Reis <matheusdrdj@gmail.com>
*           Raphael Nepomuceno <raphael.nepomuceno@ufv.br>
* @Date:   2017-11-06
*/

export default function (sequelize, DataTypes)
{
	const Address = sequelize.define('address', {
		id: {
			primaryKey:    true,
			type:          DataTypes.UUID,
			defaultValue:  DataTypes.UUIDV4
		},
		street:        { type: DataTypes.STRING, unique: 'address', allowNull: false },
		neighborhood:  { type: DataTypes.STRING, unique: 'address', allowNull: false },
		city:          { type: DataTypes.STRING, unique: 'address', allowNull: false },
		ZIPCode:       { type: DataTypes.STRING, unique: 'address', allowNull: false },
		province:      { type: DataTypes.STRING, unique: 'address', allowNull: false },
		country:       { type: DataTypes.STRING, unique: 'address', allowNull: false },
		number:        { type: DataTypes.STRING, unique: 'address', allowNull: false },
		userId:        { type: DataTypes.UUID,   unique: 'address' }
	})

	return Address
}
