// logger.js
const { createLogger, transports, format } = require('winston');
require('winston-mongodb');

const logUser = createLogger({
  transports: [
    new transports.MongoDB({
      db: "mongodb://0.0.0.0:27017/food_securitycw2",
      options: { useUnifiedTopology: true },
      collection: 'logs',
      format: format.combine(
        format.timestamp(),
        format.json()
      ),
    })
  ]
});

module.exports = logUser;
