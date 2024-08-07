const express = require("express");
const bodyParser = require('body-parser');
const fs = require("fs")
const path = require("path")
require("dotenv").config()

const router = express.Router()
const filePath = path.join(__dirname, "../db/users.json")
const readJSONFile = () => {
    try {
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8')
            return JSON.parse(data)
        } 
        return []
    } catch (error) {
        console.log(`Error is ${error}`)
        return []
    }
}
const users = readJSONFile()

const writeToJSONFile = (data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')
    } catch (error) {
        console.log("Error: ", error)
    }
}

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


const successStatusCode = process.env.successStatusCode || 2000;
const badRequestResponseCode = process.env.badRequestResponseCode || 400

router.get("/getAllUsers", (req, res) => {
    res.status(successStatusCode).json({
        succeeded: true,
        message: "Action was successful",
        statusCode: successStatusCode,
        resultData: users
    })
})

router.get(`/getUserWith/:id`, (req, res) => {
    const { id } = req.params // const id = req.params.id (destructuring)
    const oneUser = users.find(user => user.id === parseInt(id))

    if (!oneUser || oneUser === -1) {
        return res.status(badRequestResponseCode).json({
            succeeded: false,
            message: "User not found, double check parameter.",
            statusCode: badRequestResponseCode,
            resultData: null
        })
    }

    res.status(successStatusCode).json({
        succeeded: true,
        message: "Action was successful!",
        statusCode: successStatusCode,
        resultData: oneUser
    })
})

router.post("/createUser", (req, res) => {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
        return res.status(badRequestResponseCode).json({
            succeeded: false,
            message: "one or more field missing.",
            statusCode: badRequestResponseCode,
            resultData: null
        })
    }

    const oneUser = users.findIndex(user => user.email === email)

    if (oneUser !== -1) {
        return res.status(badRequestResponseCode).json({
            succeeded: false,
            message: email + ` already exists.`,
            statusCode: badRequestResponseCode,
            resultData: null
        })
    }

    const user = {
        id: Math.floor(Math.random() * 1000),
        name,email,phone
    }

    users.push(user)
    writeToJSONFile(users)

    res.status(201).json({
        succeeded: true,
        message: "User creation successful!",
        statusCode: 201,
        resultData: user
    })
    console.log(users)
})

module.exports = router