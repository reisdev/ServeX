/**
 * @Authors: Matheus Reis <matheusdrdj@gmail.com>
 *           Raphael Nepomuceno <raphael.nepomuceno@ufv.br>
 * @Date:   2017-11-06
 */

export default (seq, DataTypes) => seq.define('serviceType', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		pricingType: {
			type: DataTypes.ENUM('Onetime', 'Hourly', 'Daily'),
			allowNull: false
		}
	})
