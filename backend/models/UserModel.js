const {Sequelize, DataTypes} = require("sequelize")
const sequelize = require("../config/database")

const User = sequelize.define(
    "user",{
        id:{
            type:DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        username: {
            type: DataTypes.STRING,
            allowNull: true
        },


        email: {
            type: DataTypes.STRING,
            allowNull: true
        },

        password: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }
)

module.exports = User