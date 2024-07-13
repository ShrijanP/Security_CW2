// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const cors = require("cors");
// const path = require('path');
// const User = require("./api/models/User");
// require("dotenv").config();

// // middleware
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       console.log("url", process.env.URL);
//       const allowedOrigins = process.env.URL;

//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error('Not allowed by CORS'));
//       }
//     },
//     credentials: true
//   })
// );
// app.use(express.json());

// async function connectionDB(app) {
//   try {
//     await mongoose.connect(
//       process.env.NODE_ENV === "test" ? process.env.MONGO_DB_REMOTE_TEST : process.env.MONGO_DB_REMOTE
//       // `mongodb://localhost:27017/food`
//     );

//     // Check if there are no superAdmins in the database
//     console.log("Mongodb connected successfully!", process.env.NODE_ENV === "test" ? process.env.MONGO_DB_REMOTE_TEST : process.env.MONGO_DB_REMOTE);

//     const superAdminExists = await User.exists({ role: 'super-admin' });
//     if (!superAdminExists) {
//       // Create a superAdmin user
//       const superAdminData = {
//         name: "Super Admin",
//         email: "superadmin@gmail.com",
//         password: "$2a$10$ftbcHodcZtWQ0Bp9gfDZe.cCi6yetoKTL0zVQVHuOtmq4MsJ44g2y", //password
//         role: "super-admin"
//       };

//       await User.create(superAdminData);
//       console.log("SuperAdmin created successfully!");


//     }
//   } catch (error) {
//     console.log("Error connecting to MongoDB: " + error);
//   }
// }

// module.exports.initializeApp = async () => {
//   await connectionDB();
//   app.use(express.static(path.join(__dirname, '/')));

//   app.use('/', require('./api/routes/index'));
//   return app;
// };


// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const cors = require("cors");
// const path = require('path');
// const fs = require('fs');
// const morgan = require('morgan');
// const rfs = require('rotating-file-stream');
// const User = require("./api/models/User");
// require("dotenv").config();

// // Ensure log directory exists
// const logDirectory = path.join(__dirname, 'log');
// fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// // Create a rotating write stream for logging
// const accessLogStream = rfs.createStream('access.log', {
//   interval: '1d', // Rotate daily
//   path: logDirectory
// });

// // Setup the logger
// app.use(morgan('combined', { stream: accessLogStream }));

// // Middleware for CORS and JSON parsing
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       console.log("url", process.env.URL);
//       const allowedOrigins = process.env.URL;

//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error('Not allowed by CORS'));
//       }
//     },
//     credentials: true
//   })
// );
// app.use(express.json());

// async function connectionDB(app) {
//   try {
//     await mongoose.connect(
//       process.env.NODE_ENV === "test" ? process.env.MONGO_DB_REMOTE_TEST : process.env.MONGO_DB_REMOTE
//       // `mongodb://localhost:27017/food`
//     );

//     // Check if there are no superAdmins in the database
//     console.log("Mongodb connected successfully!", process.env.NODE_ENV === "test" ? process.env.MONGO_DB_REMOTE_TEST : process.env.MONGO_DB_REMOTE);

//     const superAdminExists = await User.exists({ role: 'super-admin' });
//     if (!superAdminExists) {
//       // Create a superAdmin user
//       const superAdminData = {
//         name: "Super Admin",
//         email: "superadmin@gmail.com",
//         password: "$2a$10$ftbcHodcZtWQ0Bp9gfDZe.cCi6yetoKTL0zVQVHuOtmq4MsJ44g2y", //password
//         role: "super-admin"
//       };

//       await User.create(superAdminData);
//       console.log("SuperAdmin created successfully!");
//     }
//   } catch (error) {
//     console.log("Error connecting to MongoDB: " + error);
//   }
// }

// module.exports.initializeApp = async () => {
//   await connectionDB();
//   app.use(express.static(path.join(__dirname, '/')));

//   app.use('/', require('./api/routes/index'));
//   return app;
// };




const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const User = require("./api/models/User");

const https=require('https');
// const server=https.createServer({key,cert},app);
require("dotenv").config();

// Ensure log directory exists
const logDirectory = path.join(__dirname, 'log');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// Create a rotating write stream for logging
const accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // Rotate daily
  path: logDirectory
});

// Setup the logger
app.use(morgan('combined', { stream: accessLogStream }));

// Middleware for CORS and JSON parsing
app.use(
  cors({
    origin: function (origin, callback) {
      console.log("url", process.env.URL);
      const allowedOrigins = process.env.URL;

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());

// Configure session
app.use(session({
  secret: 'af38da72a21577883617dfcacdaa03c2f927e00d3f205286598d4fbcd14a2775', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using https
}));

async function connectionDB(app) {
  try {
    await mongoose.connect(
      process.env.NODE_ENV === "test" ? process.env.MONGO_DB_REMOTE_TEST : process.env.MONGO_DB_REMOTE
      // `mongodb://localhost:27017/food`
    );

    // Check if there are no superAdmins in the database
    console.log("Mongodb connected successfully!", process.env.NODE_ENV === "test" ? process.env.MONGO_DB_REMOTE_TEST : process.env.MONGO_DB_REMOTE);

    const superAdminExists = await User.exists({ role: 'super-admin' });
    if (!superAdminExists) {
      // Create a superAdmin user
      const superAdminData = {
        name: "Super Admin",
        email: "superadmin@gmail.com",
        password: "$2a$10$ftbcHodcZtWQ0Bp9gfDZe.cCi6yetoKTL0zVQVHuOtmq4MsJ44g2y", //password
        role: "super-admin"
      };

      await User.create(superAdminData);
      console.log("SuperAdmin created successfully!");
    }
  } catch (error) {
    console.log("Error connecting to MongoDB: " + error);
  }
}

module.exports.initializeApp = async () => {
  await connectionDB();
  app.use(express.static(path.join(__dirname, '/')));

  app.use('/', require('./api/routes/index'));
  return app;
};




// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const cors = require("cors");
// const path = require('path');
// const fs = require('fs');
// const morgan = require('morgan');
// const rfs = require('rotating-file-stream');
// const cookieParser = require('cookie-parser');
// const session = require('express-session');
// const helmet = require('helmet');
// const expressValidator = require('express-validator');
// const xss = require('xss-clean');
// const https = require('https');
// const User = require("./api/models/User");
// require("dotenv").config();

// // Ensure log directory exists
// const logDirectory = path.join(__dirname, 'log');
// fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// // Create a rotating write stream for logging
// const accessLogStream = rfs.createStream('access.log', {
//   interval: '1d', // Rotate daily
//   path: logDirectory
// });

// // Setup the logger
// app.use(morgan('combined', { stream: accessLogStream }));

// // Use Helmet for security headers
// app.use(helmet());

// // Middleware for sanitizing inputs
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(expressValidator());
// app.use(xss());

// // Middleware for CORS and JSON parsing
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       console.log("url", process.env.URL);
//       const allowedOrigins = process.env.URL.split(","); // Assuming process.env.URL is a comma-separated string of allowed origins

//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error('Not allowed by CORS'));
//       }
//     },
//     credentials: true
//   })
// );
// app.use(cookieParser());

// // Configure session
// app.use(session({
//   secret: process.env.SECRETSESSION, // Secret key for session
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: false } // Set to true if using https
// }));

// async function connectionDB() {
//   try {
//     await mongoose.connect(
//       process.env.NODE_ENV === "test" ? process.env.MONGO_DB_REMOTE_TEST : process.env.MONGO_DB_REMOTE
//     );

//     console.log("Mongodb connected successfully!", process.env.NODE_ENV === "test" ? process.env.MONGO_DB_REMOTE_TEST : process.env.MONGO_DB_REMOTE);

//     const superAdminExists = await User.exists({ role: 'super-admin' });
//     if (!superAdminExists) {
//       const superAdminData = {
//         name: "Super Admin",
//         email: "superadmin@gmail.com",
//         password: "$2a$10$ftbcHodcZtWQ0Bp9gfDZe.cCi6yetoKTL0zVQVHuOtmq4MsJ44g2y", // password
//         role: "super-admin"
//       };

//       await User.create(superAdminData);
//       console.log("SuperAdmin created successfully!");
//     }
//   } catch (error) {
//     console.log("Error connecting to MongoDB: " + error);
//   }
// }

// async function initializeApp() {
//   await connectionDB();
//   app.use(express.static(path.join(__dirname, '/')));

//   // Use the routes defined in index.js
//   app.use('/', require('./api/routes/index'));
//   return app;
// }

// module.exports = { initializeApp };

// // HTTPS setup (make sure to replace the paths with the actual paths to your key and certificate files)
// const key = fs.readFileSync(path.join(__dirname, 'ssl', 'localhost-key.pem'));
// const cert = fs.readFileSync(path.join(__dirname, 'ssl', 'localhost.pem'));
// const server = https.createServer({ key, cert }, app);

// // Start the server
// const PORT = process.env.PORT || 8000;
// server.listen(PORT, () => {
//   console.log(`Server running on https://localhost:${PORT}`);
// });
