/**
 * @Author: Matheus Reis <matheusdrjd@gmail.com
 * @Date:   2017-11-06
 */
export default (seq, DataTypes) =>
    seq.define(
        'review',
        {
            id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
            },
            rate: DataTypes.DECIMAL(10,2),
            message: DataTypes.STRING
        }
    )