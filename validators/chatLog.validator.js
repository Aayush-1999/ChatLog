const async = require('async'),
     mongoose = require('mongoose'),
     ObjectId = mongoose.Types.ObjectId,
     utils  = require("../utils/function");



module.exports = function (data, userId) {
  return new Promise((resolve, reject) => {
    let errObj = {}, dataObj = {};
    async.series([
      function (callback) {
        // validate if data contains key
        if(utils.isValidObject(data)) {
          callback(null, true);
        }
        else {
          errObj.mssg = "Invalid Data";
          errObj.code = 400;
          callback(errObj);
        }
      },
      function (callback) {
        // validate user id
        if(utils.isValidObjectId(userId)) {
          dataObj.user = ObjectId(userId);
          callback(null, true);
        }
        else {
          errObj.mssg = "Invalid User Id";
          errObj.code = 400;
          callback(errObj);
        }
      },
      function (callback) {
        if (utils.isValid(data.message)) {
          dataObj.message = data.message;
        }
        callback(null, true);
      },
      function (callback) {
        if (utils.isValid(data.isSent)) {
          dataObj.isSent = data.isSent;
        }
        callback(null, true);
      },
      function (callback) {
        if(utils.isValid(data.createdAt)) {
          dataObj.createdAt = data.createdAt;
        }
        callback(null, true);
      }
    ], function (err, result) {
      if (err) {
        reject(err);
      }
      else {
        resolve(dataObj);
      }
    })
  })
}