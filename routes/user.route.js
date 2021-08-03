const express = require("express"),
      router  = express.Router(),
      bcrypt  = require("bcryptjs"),
      utils   = require("../utils/function");
      
const { User, UserSession }    = require("../models");

//REGISTER ROUTE
router.post("/register", async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email })
    if (user) {
      return res.send(utils.responseError("User already exists", 200));
    }
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(req.body.password, salt);
    
    user = await User.create({
      firstName: req.body.firstname,
      lastName: req.body.lastname,
      email: req.body.email,
      password: hash,
    });
    return res.send(utils.createSuccessResponse(user));
  }
  catch (err) {
    return res.send(utils.responseError("Registration Unsuccessful", 502));
  }
});

router.post("/create/session", async (req, res) => {
  try {
    let userId = req.body.userId;
    const userToken = `${userId}2324xzjzniznzcn2455`;
    const body = {
      user: userId,
      token: userToken
    }
    const userSession = await UserSession.create(body);
    return res.send(utils.createSuccessResponse(userSession));
  }
  catch (err) {
    return res.send(utils.responseError("Request Failure", 502));
  }
})

module.exports = router;