const {DataTypes} = require("sequelize");

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = async (sequelize) => {
  sequelize.define(
    "contract_records",
    {
      // Model attributes are defined here
      transactionRecord: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }
  );
};