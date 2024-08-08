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

router.put("/updateUser/:id", (req, res) => {
    const { id } = req.params
    const { name, email, phone } = req.body

    if (!name && !email && !phone) {
        return res.status(400).json({
            succeeded: true,
            message: "Provide data for update.",
            statusCode: "02",
            resultData: null
        })
    }

    const userIndex = users.findIndex(user => user.id === parseInt(id))

    console.log(`see user index ${userIndex}`)

    if (userIndex === -1) {
        return res.status(400).json({
            succeeded: true,
            message: "User not found",
            statusCode: "02",
            resultData: null
        })
    }

    if (name) users[userIndex].name = name
    if (email) users[userIndex].email = email
    if (phone) users[userIndex].phone = phone

    writeToJSONFile(users)

    res.status(successStatusCode).json({
        succeeded: true,
        message: "user updated successfully successful",
        statusCode: "00",
        resultData: users[userIndex]
    })
})

router.delete("/deleteUserWith/:id", (req, res) => {
    const { id } = req.params

    const userIndex = users.findIndex(user => user.id === parseInt(id))

    if (userIndex === -1) {
        return res.status(400).json({
            succeeded: false,
            message: `User with id ${id} not found`,
            statusCode: "02",
            resultData: null
        })
    }

    users.splice(userIndex, 1);

    writeToJSONFile(users)

    res.status(successStatusCode).json({
        succeeded: true,
        message: `User with id ${id} successfully deleted`,
        statusCode: "00",
        resultData: null
    })
})

module.exports = router