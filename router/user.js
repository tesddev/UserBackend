const express = require("express");
const bodyParser = require('body-parser');
const { getAllUsers, getUsersWith, createUser, updateUser, deleteUser } = require("../controllers/user")
require("dotenv").config()

const router = express.Router()

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/getAllUsers", getAllUsers)

router.get(`/getUserWith/:id`, getUsersWith)

router.post("/createUser", createUser)

router.put("/updateUser/:id", updateUser)

router.delete("/deleteUserWith/:id", deleteUser)

module.exports = router