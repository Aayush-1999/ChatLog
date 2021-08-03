const { UserSession } = require('../models');
const utils = require("../utils/function");

module.exports = {

  verifyUser: function (req, res, next) {
    const authToken = req.headers.token;
    UserSession.findOne({ token: authToken }).exec((err, userSession) => {
      if (err) {
        return res.send(utils.responseError(err.msg, err.code));
      }
      else if (userSession) {
        req.session = {};
        req.session.user = userSession.user;
        req.session.token = userSession.token;
        return next();
      }
      else {
        return res.send(utils.responseError("Unauthenticated User", 301));
      }
    })
  }
  
}