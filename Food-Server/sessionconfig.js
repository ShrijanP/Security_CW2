// sessionConfig.js
const session = require('express-session');
const cookieParser = require('cookie-parser');

const sessionConfig = (app) => {
  app.use(cookieParser());
  app.use(
    session({
      secret: process.env.SECRETSESSION,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: false,
      },
    })
  );
};

module.exports = sessionConfig;
