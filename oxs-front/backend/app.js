const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const checkAuth = require("./middleware/check-auth");


//MODELS
const Tenant = require("./models/tenant");
const User = require("./models/user");

const app = express();

mongoose
  .connect(
    "mongodb+srv://yossi:b5CProLmZmX4jD9G@cluster0-rex1n.mongodb.net/test?retryWrites=true",
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("Connected to Database MongoDB-Atlas");
  })
  .catch(() => {
    console.log("Connect to MongoDB failed.");
  });
mongoose.set('useCreateIndex', true);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); //no matter the domain sending the request
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    //methods allowed requests.
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

//could split it to other file but its small project
// ======================================= User Routes ===============================================

app.post("/api/users/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({//create new user with hashed password
      username: req.body.username,
      password: hash
    });
    user
      .save()//save the user in db
      .then(result => {
        const now = new Date();
        console.log("Username: "+req.body.username + " signup . timestamp : "+now.getTime());
        res.status(200).json({
          msg: "user created!",
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          msg: err
        });
      });
  });
});

app.post("/api/users/login", (req, res, next) => {
  let foundUser;
  User.findOne({ username: req.body.username }) //find the user in the db with username given
    .then(user => {
      if (!user) {//check if exist
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      foundUser = user;// save the user data to use it in other then block
      return bcrypt.compare(req.body.password, user.password);//compare the password given with hashed pass in db
    })
    .then(result => {//promise returned
      if (!result) {//failure
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      //if bcrypt comparison success
      const token = jwt.sign(//create token to send as a cookie to client
        { username: foundUser.username, userId: foundUser._id },
        "SecretHashString", //using this in the verifying
        { expiresIn: "1h" }

      );
        const now = new Date();
        console.log("Username: "+req.body.username + " logged in . timestamp : "+now.getTime());
      res.status(200).json({
        token: token,
        expiresIn: 3600
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Auth failed"
      });
    });
});

//could split it to other file but its small project
// ========================================= Tenants Routes ========================================

//post a new tenant
app.post("/api/tenants",checkAuth, (req, res, next) => {
  const tenant = new Tenant({
    name: req.body.name,
    address: req.body.address,
    phone: req.body.phone,
    financialDebt: req.body.financialDebt,
    creator: req.userData.userId//creator user id.
  });
  tenant.save().then(result => {
    res.status(201).json({
      message: "Tenant added successfully",
      tenantId: result._id //sending the created tenant id to the frontend. will help in data binding.
    });
  });
});

//update an exist tenant
app.put("/api/tenants/:id",checkAuth,(req, res, next) => {
  const tenant = new Tenant({
    _id: req.body.id,
    name: req.body.name,
    address: req.body.address,
    phone: req.body.phone,
    financialDebt: req.body.financialDebt,
    creator: req.userData.userId
  });
  Tenant.updateOne({ _id: req.params.id , creator: req.userData.userId}, tenant).then(result => {//find by id and creator
   if (result.mModifed > 0)  { //update successfully
     res.status(200).json({
       message: "Tenant edited successfully"
     });
   }else{
     res.status(401).json({
       message: "unauthorized to edit"
     });
   }

  });
});

//get a tenant by id in the url
app.get("/api/tenants/:id",checkAuth, (req, res, next) => {
  Tenant.findById(req.params.id).then(tenant => {
    if (tenant) {
      res.status(200).json(tenant);
    } else {
      res.status(404).json({ msg: "tenant not found! 404" });
    }
  }).catch(error => {
    res.status(500).json({
      message: "find tenant failed!"
    });
  });
});

//get all the user tenants
app.get("/api/tenants",checkAuth, (req, res, next) => {
  Tenant.find({creator:req.userData.userId}).then(documents => {//find the tenants that the user create
    res.status(200).json({
      message: "Tenants fetched successfully!",
      tenants: documents
    });
  });
});

//delete a tenant by id
app.delete("/api/tenants/:id",checkAuth, (req, res, next) => {
  Tenant.deleteOne({ _id: req.params.id, creator:req.userData.userId }).then(result => {
    if (result.n > 0)  { //deletion successfully
      res.status(200).json({
        message: "Tenant deleted successfully"
      });
    }else{
      res.status(401).json({
        message: "unauthorized to delete"
      });
    }
  }).catch(error => {
    res.status(500).json({
      message: "Deleting tenant failed!"
    });
  });
});

module.exports = app;
