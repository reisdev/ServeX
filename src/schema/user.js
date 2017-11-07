/**
 * @Authors: Matheus Reis <matheusdrdj@gmail.com>
 *           Raphael Nepomuceno <raphael.nepomuceno@ufv.br>
 * @Date:   2017-11-06
 */

export default (seq, DataTypes) => seq.define('user', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		email: {
			type: DataTypes.STRING,
			unique: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		},
		CPF: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: true
		},
		fullName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		averageRating: DataTypes.DECIMAL(10, 1),
		photoPath: DataTypes.STRING
	})
