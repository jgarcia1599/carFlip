const { DataTypes } = require("sequelize");

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = async (sequelize) => {
  sequelize.define("contract_records", {
    // Model attributes are defined here
    contractAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    carBuyerSubmittedReview: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    carSellerSubmittedReview: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    filePath: {
      type: DataTypes.STRING,
    },
  });
};
