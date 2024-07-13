// // // // const express = require('express');
// // // // const router = express.Router();
// // // // const userController = require('../controllers/userControllers');
// // // // const { verifyUser, verifyAuthorization } = require("../middlewares/authMiddlerware");

// // // // router.post('/login', userController.login);

// // // // router.post('/register', userController.register);

// // // // router.get('/all', verifyUser, verifyAuthorization, userController.allUser);

// // // // router.get('/my-profile', verifyUser, userController.myProfile);

// // // // router.put('/update-profile/:id', verifyUser, userController.updateProfile);

// // // // router.put('/upload-pp', verifyUser, userController.uploadPP);

// // // // router.put('/change-password', verifyUser, userController.changePassword);

// // // // router.delete('/delete-user/:id', verifyUser, verifyAuthorization, userController.deleteUser);

// // // // module.exports = router;


// // // // userRoutes.js
// // // const express = require('express');
// // // const router = express.Router();
// // // const userController = require('../controllers/userControllers');
// // // const { verifyUser, verifyAuthorization } = require("../middlewares/authMiddlerware");
// // // const logUser = require('../../logger'); // Import the logger

// // // // Log user activities
// // // const logActivity = (req, res, next) => {
// // //   const log = {
// // //     userName: req.user ? req.user.name : 'Guest',
// // //     sessionId: req.cookies["connect.sid"],
// // //     url: req.originalUrl,
// // //     method: req.method,
// // //     timestamp: new Date()
// // //   };
// // //   logUser.info(log);
// // //   next();
// // // };

// // // router.use(logActivity); // Apply the middleware to all routes

// // // router.post('/login', userController.login);
// // // router.post('/register', userController.register);
// // // router.get('/all', verifyUser, verifyAuthorization, userController.allUser);
// // // router.get('/my-profile', verifyUser, userController.myProfile);
// // // router.put('/update-profile/:id', verifyUser, userController.updateProfile);
// // // router.put('/upload-pp', verifyUser, userController.uploadPP);
// // // router.put('/change-password', verifyUser, userController.changePassword);
// // // router.delete('/delete-user/:id', verifyUser, verifyAuthorization, userController.deleteUser);

// // // module.exports = router;


// // // userRoutes.js
// // const express = require('express');
// // const router = express.Router();
// // const userController = require('../controllers/userControllers');
// // const { verifyUser, verifyAuthorization } = require("../middlewares/authMiddlerware");
// // const logUser = require('../../logger'); 

// // // Log user activities
// // const logActivity = (req, res, next) => {
// //   const log = {
// //     userName: req.user ? req.user.name : 'Guest',
// //     sessionId: req.sessionID,
// //     url: req.originalUrl,
// //     method: req.method,
// //     timestamp: new Date()
// //   };
// //   logUser.info(log);
// //   next();
// // };

// // router.use(logActivity); 

// // router.post('/login', userController.login);
// // router.post('/register', userController.register);
// // router.get('/all', verifyUser, verifyAuthorization, userController.allUser);
// // router.get('/my-profile', verifyUser, userController.myProfile);
// // router.put('/update-profile/:id', verifyUser, userController.updateProfile);
// // router.put('/upload-pp', verifyUser, userController.uploadPP);
// // router.put('/change-password', verifyUser, userController.changePassword);
// // router.delete('/delete-user/:id', verifyUser, verifyAuthorization, userController.deleteUser);

// // module.exports = router;



// const express = require('express');
// const { body, validationResult } = require('express-validator');
// const router = express.Router();
// const userController = require('../controllers/userControllers');
// const { verifyUser, verifyAuthorization } = require("../middlewares/authMiddlerware");
// const logUser = require('../../logger'); 

// // Log user activities
// const logActivity = (req, res, next) => {
//   const log = {
//     userName: req.user ? req.user.name : 'Guest',
//     sessionId: req.sessionID,
//     url: req.originalUrl,
//     method: req.method,
//     timestamp: new Date()
//   };
//   logUser.info(log);
//   next();
// };

// router.use(logActivity);

// // Validation middleware
// const validateUserRegistration = [
//   body('name').isString().trim().escape().withMessage('Name must be a string'),
//   body('email').isEmail().normalizeEmail().withMessage('Must be a valid email'),
//   body('password').isLength({ min: 8 }).trim().escape().withMessage('Password must be at least 8 characters long'),
//   body('mobile_no').isString().trim().escape().withMessage('Mobile number must be a string'),
//   (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     next();
//   }
// ];

// const validateUserLogin = [
//   body('email').isEmail().normalizeEmail().withMessage('Must be a valid email'),
//   body('password').isLength({ min: 8 }).trim().escape().withMessage('Password must be at least 8 characters long'),
//   (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     next();
//   }
// ];

// router.post('/login', validateUserLogin, userController.login);
// router.post('/register', validateUserRegistration, userController.register);
// router.get('/all', verifyUser, verifyAuthorization, userController.allUser);
// router.get('/my-profile', verifyUser, userController.myProfile);
// router.put('/update-profile/:id', verifyUser, userController.updateProfile);
// router.put('/upload-pp', verifyUser, userController.uploadPP);
// router.put('/change-password', verifyUser, userController.changePassword);
// router.delete('/delete-user/:id', verifyUser, verifyAuthorization, userController.deleteUser);

// module.exports = router;


// userRoutes.js
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
