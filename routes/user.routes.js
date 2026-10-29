const express = require('express')
const router = express.Router();
const authmiddleware = require('../middleware/auth.middleware')
const UserController = require('../controller/temp.controller');
router.post('/signup', UserController.signup);
router.post('/login', UserController.login);
router.get('/getAllUsers', authmiddleware, UserController.getAllUsers)
router.delete('/softDelete/:id', UserController.softDeleteUser)
router.put("/:id", authmiddleware,UserController.updateUser);
// router.patch('/patch/:id',UserController.update)
// router.post('/adduserprofile',authmiddleware,UserController.adduserprofile)
module.exports = router