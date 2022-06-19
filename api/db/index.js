const Sequelize = require("sequelize");
console.log(process.env.DB_URL)
const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: "postgres",
  protocol: "postgres",
  logging: false
  // dialectOptions: {
  //     ssl: {
  //         require: true,
  //         rejectUnauthorized: false
  //     }
  // }
});
// We export the sequelize connection instance to be used around our app.
module.exports = sequelize;
