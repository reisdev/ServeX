/**
* @Author: Matheus Reis <matheusdrdj@gmail.com>
* @Author: Raphael Nepomuceno <raphael.nepomuceno@ufv.br>
*/

import bcrypt from 'bcrypt'

export default function (sequelize, DataTypes)
{
	const User = sequelize.define('user', {
		id: {
			primaryKey:    true,
			type:          DataTypes.UUID,
			defaultValue:  DataTypes.UUIDV4
		},
		email:         { type: DataTypes.STRING,                  unique: true },
		password:      { type: DataTypes.STRING, allowNull: false              },
		CPF:           { type: DataTypes.STRING, allowNull: true, unique: true },
		fullname:      { type: DataTypes.STRING, allowNull: false              },
		rating:                DataTypes.DECIMAL(10, 1),
		photoPath:     { type: DataTypes.STRING, allowNull: true               },
		authLevel:     { type: DataTypes.ENUM('User', 'Admin'), allowNull: false }
	})

	User.prototype.authenticate = function (password)
	{
		return bcrypt.compareSync(password, this.password)
	}

	User.beforeCreate(user => user.password = bcrypt.hashSync(user.password, 10))

	return User
}
