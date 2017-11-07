/**
 * @Authors: Matheus Reis <matheusdrdj@gmail.com>
 *           Raphael Nepomuceno <raphael.nepomuceno@ufv.br>
 * @Date:   2017-11-06
 */

export default (seq, DataTypes) => seq.define('creditCard', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
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
