/**
 * @Authors: Matheus Reis <matheusdrdj@gmail.com>
 *           Raphael Nepomuceno <raphael.nepomuceno@ufv.br>
 * @Date:   2017-11-06
 */

 export default (seq, DataTypes) => seq.define('serviceOffer', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		title: DataTypes.STRING,
		description: DataTypes.STRING,
		basePrice: DataTypes.DECIMAL(10, 2)
	})
