/**
 * @Authors: Matheus Reis <matheusdrdj@gmail.com>
 *           Raphael Nepomuceno <raphael.nepomuceno@ufv.br>
 * @Date:   2017-11-06
 */

export default (seq, DataTypes) => seq.define('address', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		street: {
			type: DataTypes.STRING,
			allowNull: false
		},
		neighborhood: {
			type: DataTypes.STRING,
			allowNull: false
		},
		city: {
			type: DataTypes.STRING,
			allowNull: false
		},
		ZIPCode: {
			type: DataTypes.STRING,
			allowNull: false
		},
		province: {
			type: DataTypes.STRING,
			allowNull: false
		},
		country: {
			type: DataTypes.STRING,
			allowNull: false
		},
	})
