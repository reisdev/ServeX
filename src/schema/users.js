/**
 * @Author: Matheus Reis <matheusdrjd@gmail.com
 * @Date:   2017-11-06
 */
export default (seq,DataTypes) =>
    seq.define(
        'users',
        {
            id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
            email: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            CPF: {
                type: DataTypes.INTEGER,
                unique: true,
                allowNull: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            rating: DataTypes.DECIMAL(10,1),
            photo: DataTypes.STRING
        }
    )

