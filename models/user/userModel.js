const Sequelize= require("sequelize");
const sequelize= require("../../utils/database");

const User= sequelize.sequelize.define('user_tbl',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    name:Sequelize.TEXT,
    email:Sequelize.TEXT,
    password:Sequelize.TEXT,
})

module.exports = User;