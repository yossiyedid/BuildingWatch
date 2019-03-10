const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({      //user schema for mongoDB using mongoose schema
  username: { type: String, required: true , unique : true},
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); //take care to if username already exist ('unique' property)

module.exports = mongoose.model("User", userSchema);

