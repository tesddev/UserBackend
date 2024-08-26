
require("dotenv").config()
const { readJSONFile, writeToJSONFile } = require("../utils/helper");
// const users = readJSONFile()
const User = require("../models/user");
const successStatusCode = process.env.successStatusCode || 2000;
const badRequestResponseCode = process.env.badRequestResponseCode || 400



const getAllUsers =  async (_req, res) => {
    try {
        const users = await User.find()
        res.status(200).json({
            succeeded: true,
            message: "Action was successful",
            statusCode: successStatusCode,
            resultData: users
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            succeeded: true,
            message: "Internal server error",
            statusCode: "08",
            resultData: null
        })
    }
    
}

const getUsersWith = async (req, res) => {
    try {
        const { _id } = req.params // const id = req.params.id (destructuring)
    const user = await User.findOne({_id});

    if (!user) {
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
        resultData: user
    })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            succeeded: true,
            message: "Internal server error",
            statusCode: "08",
            resultData: null
        })
    }
}

const createUser = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const existingUser = await User.findOne({ email });

        if (!name || !email || !phone) {
            return res.status(badRequestResponseCode).json({
                succeeded: false,
                message: "one or more field missing.",
                statusCode: badRequestResponseCode,
                resultData: null
            })
        }

        if (existingUser) {
            return res.status(badRequestResponseCode).json({
                succeeded: false,
                message: email + ` already exists.`,
                statusCode: badRequestResponseCode,
                resultData: null
            })
        }

        const user = new User({
            name,email,phone
        })

        /// To save user to mongodb
        const savedUser = await user.save()

        res.status(201).json({
            succeeded: true,
            message: "User creation successful!",
            statusCode: 201,
            resultData: savedUser
        })
        console.log(savedUser)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            succeeded: true,
            message: "Internal server error",
            statusCode: "08",
            resultData: null
        })
    }
}

const updateUser = async (req, res) => {
    try {
        const { _id } = req.params
        const { name, email, phone } = req.body
        const existingUser = await User.findById(_id);

        if (!name && !email && !phone) {
            return res.status(400).json({
                succeeded: true,
                message: "Provide data for update.",
                statusCode: "02",
                resultData: null
            })
        }
        console.log(`see user ${existingUser}`)
        if (!existingUser) {
            return res.status(400).json({
                succeeded: true,
                message: "User not found",
                statusCode: "02",
                resultData: null
            })
        }

        if (name) existingUser.name = name
        if (email) existingUser.email = email
        if (phone) existingUser.phone = phone

        const savedUser = await existingUser.save()

        res.status(successStatusCode).json({
            succeeded: true,
            message: "user updated successfully successful",
            statusCode: "00",
            resultData: savedUser
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            succeeded: true,
            message: "Internal server error",
            statusCode: "08",
            resultData: null
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const { _id } = req.params
        const existingUser = await User.findByIdAndDelete(_id);

        if (!existingUser) {
            return res.status(400).json({
                succeeded: false,
                message: `User with id ${_id} not found`,
                statusCode: "02",
                resultData: null
            })
        }

        res.status(successStatusCode).json({
            succeeded: true,
            message: `User with id ${_id} successfully deleted`,
            statusCode: "00",
            resultData: null
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            succeeded: true,
            message: "Internal server error",
            statusCode: "08",
            resultData: null
        })
    }
}


module.exports = {
    getAllUsers, getUsersWith, createUser, updateUser, deleteUser
}