const {applyAssociations} = require("./associations");
const sequelize = require("./index");

// We define all models according to their files.
const modelDefiners = [
  require("./models/contract_records.model")
];

async function setupDB(force_sync = true) {
  try {
    // We define the models
    for (const modelDefiner of modelDefiners) {
      await modelDefiner(sequelize);
    }

    // We execute any extra setup after the models are defined, such as adding associations.
    await applyAssociations(sequelize);
    console.log(`Checking database connection...`);

    // sync sequelize
    //
    await sequelize.sync({force: force_sync});

    // add default values
    await createDefaultValues(sequelize);

    // we authenticate to the database server
    // await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.log("Unable to setup =-the database:");
    console.log(error);
    process.exit(1);
  }
}

async function createDefaultValues(db) {
  // add any default values here
}

module.exports = {setupDB};
