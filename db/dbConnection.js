const { default: mongoose } = require("mongoose");

const dbConnection = (connectionString) => {
    mongoose.connect(connectionString)
        .then(() => {
            console.log("Database connection established");
        })
        .catch((error) => {
            console.log(`Database connection failed: ${error}`);
        });
};

module.exports = dbConnection;