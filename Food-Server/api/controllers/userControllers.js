// const Joi = require("joi");
// const User = require("../models/User");
// const httpStatus = require("http-status");
// const jwt = require("jsonwebtoken");
// const bcrypt = require('bcryptjs');
// const upload = require("../middlewares/uploads");
// const Cart = require("../models/Carts");
// const { MAX_LOGIN_ATTEMPTS, LOCK_TIME, PASSWORD_EXPIRATION } = require('../config'); // Adjust path if necessary

// const userValidationSchema = Joi.object({
//   name: Joi.string().required(),
//   email: Joi.string().email().required(),
//   password: Joi.string().required(),
//   mobile_no: Joi.string().required()
// });

// const loginValidationSchema = Joi.object({
//   email: Joi.string().email().required(),
//   password: Joi.string().required()
// });

// const createCart = async (user) => {
//   try {
//     const activeCart = await Cart.findOne({
//       user_id: user._id,
//       status: "CART"
//     });
//     if (activeCart) return;

//     const result = await Cart.findOne({}).sort({ _id: -1 });
//     const cart_no = result ? result.cart_no + 1 : 1000;

//     await Cart.create({ cart_no, user_id: user._id });
//   } catch (error) {
//     throw error;
//   }
// };

// const register = async (req, res, next) => {
//   try {
//     const { error } = userValidationSchema.validate(req.body);
//     if (error) {
//       return res.status(httpStatus.BAD_REQUEST).json({
//         success: false,
//         msg: error.message
//       });
//     }

//     const checkUserExist = await User.findOne({
//       email: req.body.email
//     });
//     if (checkUserExist) {
//       return res.status(httpStatus.CONFLICT).json({
//         success: false,
//         msg: "User Already Exists!!"
//       });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hash = await bcrypt.hash(req.body.password, salt);

//     const user = await User.create({ ...req.body, password: hash });
//     if (user) {
//       await createCart(user);
//       return res.status(httpStatus.OK).json({
//         success: true,
//         msg: 'Registration Completed'
//       });
//     } else {
//       return res.status.httpStatus.INTERNAL_SERVER_ERROR.json({
//         success: false,
//         msg: "Failed to Register!!"
//       });
//     }
//   } catch (error) {
//     return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       msg: error.message
//     });
//   }
// };

// const login = async (req, res, next) => {
//   try {
//     const { error } = loginValidationSchema.validate(req.body);
//     if (error) {
//       return res.status(httpStatus.BAD_REQUEST).json({
//         success: false,
//         msg: error.message
//       });
//     }
//     const user = await User.findOne({
//       email: req.body.email
//     });

//     if (!user) {
//       console.log('User not found');
//       return res.status(httpStatus.UNAUTHORIZED).json({
//         success: false,
//         msg: "User Not Registered!!"
//       });
//     }

//     if (user.lockedUntil && user.lockedUntil > Date.now()) {
//       console.log('Account is locked');
//       return res.status(httpStatus.FORBIDDEN).json({
//         success: false,
//         msg: 'Account is locked. Try again later.'
//       });
//     }

//     if (user.isPasswordExpired()) {
//       console.log('Password expired');
//       return res.status(httpStatus.FORBIDDEN).json({
//         success: false,
//         msg: 'Password expired. Please reset your password.'
//       });
//     }

//     const checkPassword = await bcrypt.compare(req.body.password, user.password);
//     console.log('Entered Password:', req.body.password);
//     console.log('Hashed Password:', user.password);
//     console.log('Password Match:', checkPassword);

//     if (!checkPassword) {
//       user.loginAttempts += 1;
//       if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
//         user.lockedUntil = new Date(Date.now() + LOCK_TIME);
//         user.loginAttempts = 0; // Reset attempts after locking
//       }
//       await user.save();
//       console.log('Incorrect password');
//       return res.status(httpStatus.UNAUTHORIZED).json({
//         success: false,
//         msg: "Email or Password Incorrect!!"
//       });
//     }

//     user.loginAttempts = 0;
//     await user.save();

//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

//     const { password, __v, ...data } = user.toObject();

//     await createCart(user);

//     return res.status(httpStatus.OK).json({
//       success: true,
//       msg: "Login Success!!",
//       data: {
//         ...(data),
//         token
//       }
//     });
//   } catch (error) {
//     console.log('Error:', error);
//     return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       msg: error.message
//     });
//   }
// };

// const allUser = async (req, res, next) => {
//   try {
//     const { page = 1, size = 10, sort = { _id: -1 } } = req.query;

//     let searchQuery = {};

//     if (req.query.search) {
//       searchQuery = {
//         ...searchQuery,
//         name: { $regex: req.query.search, $options: 'i' }
//       };
//     }

//     const users = await User.find(searchQuery).select("name email mobile_no image").skip((page - 1) * size).limit(size).sort(sort);

//     const totalCount = await User.countDocuments();
//     return res.status(httpStatus.OK).json({
//       success: true,
//       msg: "Users!!",
//       data: users,
//       page,
//       size,
//       totalCount
//     });

//   } catch (error) {
//     return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       msg: "Something Went Wrong!!"
//     });
//   }
// };

// const myProfile = async (req, res, next) => {
//   try {
//     const { password, role, createdAt, updatedAt, __v, ...data } = req.user;
//     return res.status(httpStatus.OK).json({
//       success: true,
//       msg: "User!!",
//       data: data
//     });
//   } catch (error) {
//     return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       msg: "Something Went Wrong!!"
//     });
//   }
// };

// const updateProfile = async (req, res, next) => {
//   try {
//     const id = req.params.id;
//     const user = await User.findById(id);
//     if (!user) {
//       return res.status(httpStatus.NOT_FOUND).json({
//         success: false,
//         msg: "User Not Registered!!"
//       });
//     }

//     await User.findByIdAndUpdate(
//       id,
//       req.body,
//       { new: true }
//     );

//     return res.status(httpStatus.OK).json({
//       success: true,
//       msg: "User Profile Updated!!"
//     });
//   } catch (error) {
//     return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       msg: "Something Went Wrong!!"
//     });
//   }
// };

// const uploadPP = async (req, res) => {
//   upload.single('image')(req, res, async error => {
//     if (error) {
//       return res.status(httpStatus.BAD_REQUEST).json({
//         success: false,
//         msg: error.message
//       });
//     }
//     try {
//       console.log("req.file", req.file);
//       await User.findByIdAndUpdate(req.user._id, {
//         image: req.file ? req.file.path : ''
//       });
//       return res.status(httpStatus.OK).json({
//         success: true,
//         msg: "Profile Image Updated!!",
//         data: {
//           image: req.file ? req.file.path : ''
//         }
//       });
//     } catch (error) {
//       console.log("error", error);
//       return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//         success: false,
//         msg: "Something Went Wrong!!"
//       });
//     }
//   });
// };

// const changePassword = async (req, res) => {
//   try {
//     const { oldpassword, newpassword } = req.body;

//     const checkPassword = await bcrypt.compare(oldpassword, req.user.password);
//     if (!checkPassword) {
//       return res.status(httpStatus.UNAUTHORIZED).json({
//         success: false,
//         msg: "Invalid Credential!!"
//       });
//     }
//     bcrypt.genSalt(10, async (error, salt) => {
//       bcrypt.hash(newpassword, salt, async (error, hash) => {
//         await User.findByIdAndUpdate(req.user._id, {
//           password: hash,
//           passwordLastChanged: Date.now() // Update password change date
//         }, { new: true });
//       });
//     });
//     return res.status(httpStatus.OK).json({
//       success: true,
//       msg: "Password Changed!!"
//     });
//   } catch (error) {
//     console.log("error", error);
//     return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       msg: "Something Went Wrong!!"
//     });
//   }
// };

// const deleteUser = async (req, res) => {
//   const userId = req.params.id;
//   try {
//     const deletedUser = await User.findByIdAndDelete(userId);
//     if (!deletedUser) {
//       return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
//     }

//     return res.status(httpStatus.OK).json({ success: true, message: "User Deleted Successfully" });
//   } catch (error) {
//     return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
//   }
// };

// module.exports = {
//   login,
//   register,
//   allUser,
//   myProfile,
//   updateProfile,
//   uploadPP,
//   changePassword,
//   deleteUser,
//   createCart
// };



const Joi = require("joi");
const User = require("../models/User");
const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const upload = require("../middlewares/uploads");
const Cart = require("../models/Carts");
const { MAX_LOGIN_ATTEMPTS, LOCK_TIME, PASSWORD_EXPIRATION } = require('../config'); // Adjust path if necessary

const userValidationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  mobile_no: Joi.string().required()
});

const loginValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const createCart = async (user) => {
  try {
    const activeCart = await Cart.findOne({
      user_id: user._id,
      status: "CART"
    });
    if (activeCart) return;

    const result = await Cart.findOne({}).sort({ _id: -1 });
    const cart_no = result ? result.cart_no + 1 : 1000;

    await Cart.create({ cart_no, user_id: user._id });
  } catch (error) {
    throw error;
  }
};

const register = async (req, res, next) => {
  try {
    const { error } = userValidationSchema.validate(req.body);
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        msg: error.message
      });
    }

    const checkUserExist = await User.findOne({
      email: req.body.email
    });
    if (checkUserExist) {
      return res.status(httpStatus.CONFLICT).json({
        success: false,
        msg: "User Already Exists!!"
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    const user = await User.create({ ...req.body, password: hash });
    if (user) {
      await createCart(user);
      return res.status(httpStatus.OK).json({
        success: true,
        msg: 'Registration Completed'
      });
    } else {
      return res.status.httpStatus.INTERNAL_SERVER_ERROR.json({
        success: false,
        msg: "Failed to Register!!"
      });
    }
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: error.message
    });
  }
};

const login = async (req, res, next) => {
  try {
    const { error } = loginValidationSchema.validate(req.body);
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        msg: error.message
      });
    }
    const user = await User.findOne({
      email: req.body.email
    });

    if (!user) {
      console.log('User not found');
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        msg: "User Not Registered!!"
      });
    }

    if (user.lockedUntil && user.lockedUntil > Date.now()) {
      console.log('Account is locked');
      return res.status(httpStatus.FORBIDDEN).json({
        success: false,
        msg: 'Account is locked. Try again later.'
      });
    }

    if (user.isPasswordExpired()) {
      console.log('Password expired');
      return res.status(httpStatus.FORBIDDEN).json({
        success: false,
        msg: 'Password expired. Please reset your password.'
      });
    }

    const checkPassword = await bcrypt.compare(req.body.password, user.password);
    console.log('Entered Password:', req.body.password);
    console.log('Hashed Password:', user.password);
    console.log('Password Match:', checkPassword);

    if (!checkPassword) {
      user.loginAttempts += 1;
      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockedUntil = new Date(Date.now() + LOCK_TIME);
        user.loginAttempts = 0; // Reset attempts after locking
      }
      await user.save();
      console.log('Incorrect password');
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        msg: "Email or Password Incorrect!!"
      });
    }

    user.loginAttempts = 0;
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    const { password, __v, ...data } = user.toObject();

    await createCart(user);

    return res.status(httpStatus.OK).json({
      success: true,
      msg: "Login Success!!",
      data: {
        ...(data),
        token
      }
    });
  } catch (error) {
    console.log('Error:', error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: error.message
    });
  }
};

const allUser = async (req, res, next) => {
  try {
    const { page = 1, size = 10, sort = { _id: -1 } } = req.query;

    let searchQuery = {};

    if (req.query.search) {
      searchQuery = {
        ...searchQuery,
        name: { $regex: req.query.search, $options: 'i' }
      };
    }

    const users = await User.find(searchQuery).select("name email mobile_no image").skip((page - 1) * size).limit(size).sort(sort);

    const totalCount = await User.countDocuments();
    return res.status(httpStatus.OK).json({
      success: true,
      msg: "Users!!",
      data: users,
      page,
      size,
      totalCount
    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: "Something Went Wrong!!"
    });
  }
};

const myProfile = async (req, res, next) => {
  try {
    const { password, role, createdAt, updatedAt, __v, ...data } = req.user;
    return res.status(httpStatus.OK).json({
      success: true,
      msg: "User!!",
      data: data
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: "Something Went Wrong!!"
    });
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({
        success: false,
        msg: "User Not Registered!!"
      });
    }

    await User.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    return res.status(httpStatus.OK).json({
      success: true,
      msg: "User Profile Updated!!"
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: "Something Went Wrong!!"
    });
  }
};

const uploadPP = async (req, res) => {
  upload.single('image')(req, res, async error => {
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        msg: error.message
      });
    }
    try {
      console.log("req.file", req.file);
      await User.findByIdAndUpdate(req.user._id, {
        image: req.file ? req.file.path : ''
      });
      return res.status(httpStatus.OK).json({
        success: true,
        msg: "Profile Image Updated!!",
        data: {
          image: req.file ? req.file.path : ''
        }
      });
    } catch (error) {
      console.log("error", error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        msg: "Something Went Wrong!!"
      });
    }
  });
};

const changePassword = async (req, res) => {
  try {
    const { oldpassword, newpassword } = req.body;

    const checkPassword = await bcrypt.compare(oldpassword, req.user.password);
    if (!checkPassword) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        msg: "Invalid Credential!!"
      });
    }

    if (await req.user.isPasswordInHistory(newpassword)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        msg: "Password has been used recently. Please choose a different password."
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newpassword, salt);

    req.user.passwordHistory.push({
      password: req.user.password,
      changedAt: new Date()
    });

    req.user.password = hash;
    req.user.passwordLastChanged = new Date();
    await req.user.save();

    return res.status(httpStatus.OK).json({
      success: true,
      msg: "Password Changed!!"
    });
  } catch (error) {
    console.log("error", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: "Something Went Wrong!!"
    });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
    }

    return res.status(httpStatus.OK).json({ success: true, message: "User Deleted Successfully" });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

module.exports = {
  login,
  register,
  allUser,
  myProfile,
  updateProfile,
  uploadPP,
  changePassword,
  deleteUser,
  createCart
};
