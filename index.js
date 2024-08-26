const express = require("express");
const router = require("./router/user");
const bodyParser = require('body-parser');
const dbConnection = require("./db/dbConnection");

require("dotenv").config()

const app = express();

const port = process.env.PORT || 4001;

const connectionString = process.env.CONNECTION_STRING

app.get("/", (req, res) => {
    res.status(200).json("welcome to user home page")
});

app.use("/api", router)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});

dbConnection(connectionString)