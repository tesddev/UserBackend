const express = require("express");
const bodyParser = require('body-parser');
const { getAllUsers, getUsersWith, createUser, updateUser, deleteUser } = require("../controllers/user")
require("dotenv").config()

const router = express.Router()

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/getAllUsers", getAllUsers)

router.get(`/getUserWith/:_id`, getUsersWith)

router.post("/createUser", createUser)

router.put("/updateUser/:_id", updateUser)

router.delete("/deleteUserWith/:_id", deleteUser)

module.exports = router