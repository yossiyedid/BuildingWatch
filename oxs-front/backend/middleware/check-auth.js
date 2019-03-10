const jwt = require("jsonwebtoken");

module.exports = (req,res,next) => {
 try{
   const token =req.headers.authorization.split(" ")[1];//some APIs use 'Bearer' string as a first word of a token
   const decodedToken = jwt.verify(token,"SecretHashString");
   req.userData = { username:decodedToken.username, userId:decodedToken.userId};//adding the user data to the request to use it in other parts
   next();//move on - this func is a middleware
 }catch (e) {
  res.status(401).json({msg: "Auth Failed"})
 }

};
