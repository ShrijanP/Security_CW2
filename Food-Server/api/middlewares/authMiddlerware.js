const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const userModel = require('../models/User');

const decodeToken = (authorization) => {
  try {
    const token = authorization.split(' ')[1];
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

const getUser = async (userId) => {
  try {
    return await userModel.findById(userId).lean();
  } catch (error) {
    return null;
  }
};

const handleUnauthorizedAccess = (res) => {
  return res
    .status(httpStatus.UNAUTHORIZED)
    .json({ success: false, message: 'Unauthorized access' });
};

const verifyUser = async (req, res, next) => {
  if (req.headers.authorization === undefined) {
    return handleUnauthorizedAccess(res);
  }
  let decodedResult = decodeToken(req.headers.authorization);
  if (decodedResult == null || decodedResult == undefined)
    return handleUnauthorizedAccess(res);

  let userData = await getUser(decodedResult.userId);
  if (userData == null) return handleUnauthorizedAccess(res);
  req.user = userData;
  next();
};

const verifyAuthorization = (req, res, next) => {
  const role = req.user.role
  if (role.includes('admin') || role.includes('super-admin')) {
    next();
  }else{
    return handleUnauthorizedAccess(res);
  }
};

module.exports = { verifyUser, verifyAuthorization };






// const jwt = require('jsonwebtoken');

// // Generating JWT token
// const token = jwt.sign(
//   {
//     userId: user._id,
//     role: user.role,
//     passwordExpired: false,
//   },
//   process.env.SECRETJWT,
//   { expiresIn: '3d' }
// );

// // Verifying JWT token
// const verifyToken = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) {
//     return res.status(401).json({ error: ' no authentication token' });
//   }

//   jwt.verify(token, process.env.SECRETJWT, (err, payload) => {
//     if (err) return res.status(401).json({ error: err.message });
//     req.user = payload;
//     next();
//   });
// };
