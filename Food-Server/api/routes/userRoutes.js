


const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');
const { verifyUser, verifyAuthorization } = require("../middlewares/authMiddlerware");
const logUser = require('../../logger'); 
const bodyParser = require('body-parser');
const csurf = require('csurf');

// Log user activities
const logActivity = (req, res, next) => {
  const log = {
    userName: req.user ? req.user.name : 'Guest',
    sessionId: req.sessionID,
    url: req.originalUrl,
    method: req.method,
    timestamp: new Date()
  };
  logUser.info(log);
  next();
};

const parseForm = bodyParser.urlencoded({ extended: false });
const csrfProtection = csurf({ cookie: true });

router.use(logActivity);

router.post('/login', userController.login);
router.post('/register', userController.register);
router.get('/all', verifyUser, verifyAuthorization, userController.allUser);
router.get('/my-profile', verifyUser, userController.myProfile);
router.put('/update-profile/:id', verifyUser, parseForm, csrfProtection, userController.updateProfile);
router.put('/upload-pp', verifyUser, userController.uploadPP);
router.put('/change-password', verifyUser, parseForm, csrfProtection, userController.changePassword);
router.delete('/delete-user/:id', verifyUser, verifyAuthorization, parseForm, csrfProtection, userController.deleteUser);

module.exports = router;
