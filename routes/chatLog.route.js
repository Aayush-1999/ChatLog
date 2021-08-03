const express = require("express"),
      router  = express.Router(),
      mongoose = require("mongoose"),
      ObjectId = mongoose.Types.ObjectId,
      ChatLogValidator = require("../validators/chatLog.validator"),
      utils    = require("../utils/function"),
      middleware = require("../middlewares/authentication");

const { ChatLog } = require("../models");

// Create Chat log
router.post('/:userId', async (req, res) => {
  try {
    ChatLogValidator(req.body, req.params.userId)
      .then((resObj) => {
        ChatLog.create(resObj, (err, chatObj) => {
          if(err) {
            res.send(utils.responseError(err.mssg, err.code));
          }
          else {
            res.send(utils.createSuccessResponse(chatObj._id));
          }
        })
      })
      .catch((err) => {
        res.send(utils.responseError(err.mssg, err.code));
      })
  }
  catch (err) {
    res.send(utils.responseError("Bad Gateway", 502));
  }
});

// Get chat logs of a user
router.get('/:userId', middleware.verifyUser, (req, res) => {
  try {
    if(utils.isValidObjectId(req.params.userId) && req.params.userId == req.session.user) {
      let skip = parseInt(req.query.skip) || 0;
      let limit = parseInt(req.query.limit) || 10;
      ChatLog.find({user : ObjectId(req.params.userId)}).skip() 
      .skip(skip)
      .limit(limit)
      .sort({_id: -1})
      .lean()
      .exec((err, chatRes) => {
        if(err) {
          res.send(utils.responseError(err.mssg, err.code));
        }
        else if(chatRes && chatRes.length) {
          res.send(utils.createSuccessResponse(chatRes));
        }
        else {
          res.send(utils.responseError("No Data Found", 200));
        }
      })
    }
    else {
      res.send(utils.responseError("Invalid User Id", 204));
    }
  }
  catch (err) {
    res.send(utils.responseError("Bad Gateway", 502));
  }
});


// Delete chat logs of a user
router.delete('/:userId', middleware.verifyUser, (req, res) => {
  try {
    if(utils.isValidObjectId(req.params.userId)) {
      ChatLog.find({user: ObjectId(req.params.userId)}, (err, chatLog) => {
        if(err) {
          res.send(utils.responseError(err.mssg, err.code));
        }
        else if(chatLog && chatLog.length){
          ChatLog.remove({user : ObjectId(req.params.userId)}, (err, result) => {
            if(err) {
              res.send(utils.responseError(err.mssg, err.code));
            }
            else {
              res.send(utils.createSuccessResponse({}));
            }
          })
        }
        else {
          res.send(utils.responseError("No Data Found", 200));
        }
      })
    }
    else {
      res.send(utils.responseError("Invalid User Id", 204));
    }
  }
  catch (err) {
    res.send(utils.responseError("Bad Gateway", 502));
  }
});

// Delete chat logs by message Id
router.delete('/:userId/:msgId', middleware.verifyUser, (req, res) => {
  try {
    if(utils.isValidObjectId(req.params.userId)) {
      if(utils.isValidObjectId(req.params.msgId)) {
        ChatLog.findOne({_id: ObjectId(req.params.msgId)}, (err, chatLog) => {
          if(err) {
            res.send(utils.responseError(err.mssg, err.code));
          }
          else if(chatLog){
            ChatLog.deleteOne({_id : ObjectId(req.params.msgId)}, (err, result) => {
              if(err) {
                res.send(utils.responseError(err.mssg, err.code));
              }
              else {
                res.send(utils.createSuccessResponse({}));
              }
            })
          }
          else {
            res.send(utils.responseError("No Message Found", 200));
          }
        })
      }
      else {
        res.send(utils.responseError("Invalid Message Id", 204));
      }
    }
    else {
      res.send(utils.responseError("Invalid User Id", 204));
    }
  }
  catch (err) {
    res.send(utils.responseError("Bad Gateway", 502));
  }
});
  
module.exports = router;