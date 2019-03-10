const mongoose = require("mongoose");

const tenantSchema = mongoose.Schema({      //tenant schema for mongoDB
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  financialDebt: { type: Number, required: true },
  creator: {type:mongoose.Schema.Types.ObjectId, required:true, ref:"User"} //creating tenant reference to user
});

module.exports = mongoose.model("Tenant", tenantSchema);

