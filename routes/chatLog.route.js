const express = require("express"),
      router  = express.Router(),
      mongoose = require("mongoose"),
      ObjectId = mongoose.Types.ObjectId,
      ChatLogValidator = require("../validators/chatLog.validator"),
      utils    = require("../utils/function");

const { ChatLog } = require("../models");

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

router.get('/:userId', (req, res) => {
  try {
    if(utils.isValidObjectId(req.params.userId)) {
      let skip = req.query.skip || 0;
      let limit = req.query.limit || 10;
      ChatLog.find({user : ObjectId(req.params.userId)})
      .skip(skip)
      .limit(limit)
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

router.delete('/:userId', (req, res) => {
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

router.delete('/:userId/:msgId', (req, res) => {
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