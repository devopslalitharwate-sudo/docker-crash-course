const express = require("express")
const UserController = require("../controllers/UserController")

const router = express.Router()

router.get("/:id",UserController.getUser)
router.get("/",UserController.getUsers)
router.delete("/:id",UserController.deleteUser)
router.post("/",UserController.createUser)
router.put("/:id",UserController.updateUser)

module.exports = router