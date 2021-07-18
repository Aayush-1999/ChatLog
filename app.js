const express      = require("express"),
      app          = express(),
      cors         = require("cors"),
      bodyParser   = require("body-parser"),
      mongoose     = require("mongoose");

require("dotenv").config();

//ROUTES
const UserRoute  = require("./routes/user.route");
const chatLogRoute  = require("./routes/chatLog.route");

mongoose.connect(process.env.DATABASEURL,{ useUnifiedTopology: true ,useNewUrlParser:true});
mongoose.set("useFindAndModify",false);
mongoose.set("useCreateIndex",true);

app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use("/", UserRoute);
app.use("/chatlogs", chatLogRoute);

app.listen(process.env.PORT || 3000)
{
    console.log("Server has started");
}