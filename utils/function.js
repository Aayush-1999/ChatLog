// NPMs
const mongoose = require('mongoose');

module.exports = {
  isValid: function (value) {
    return (typeof value != 'undefined' && value != undefined && value != null && value != '' && value != 'null' && value != 'undefined');
  },

  isValidObject: function (object) {
    return (this.isValid(object) && Object.keys(object).length > 0);
  },
  
  isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
  },

  responseError: function (errorMsg, statusCode, data = null) {
    var sendData = {
      success: false,
      data: null,
      statusCode: statusCode,
      errorMsg: errorMsg
    }; 

    if (this.isValid(data)) {
      sendData.data = data;
    }

    return sendData;
  },

  createSuccessResponse: function (response) {
    return ({ success: true, statusCode: 200, data: response });
  },

}
