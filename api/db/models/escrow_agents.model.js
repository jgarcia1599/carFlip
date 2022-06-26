const {DataTypes} = require("sequelize");

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = async (sequelize) => {
  sequelize.define(
    "escrow_agents",
    {
      // Model attributes are defined here
      agentAddress: {
        type: DataTypes.STRING,
        allowNull: false
      }, 
      contractsEscrowed: {
        type: DataTypes.INTEGER,
        defaultValue:0,
        allowNull: false
      },
      commissionEarned: {
        type: DataTypes.FLOAT,
        defaultValue:0
      },
      reviewsReceived: {
        type: DataTypes.FLOAT,
        defaultValue:0
      },
      avgReview: {
        type: DataTypes.FLOAT,
        defaultValue:0
      },
    }
  );
};
