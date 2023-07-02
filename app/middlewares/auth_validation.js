const { verify } = require("jsonwebtoken");

module.exports = {
  checkToken: (req, res, next) => {
    console.log("This is ln 6 from middleware",req)
    let token = req.get("authorization");
    // console.log("This is ln 6 from middleware",token)
    if (token) {
      token = token.slice(7);
      verify(token, "avah100token", (err, decode) => {
        if (err) {
          res.json({
            error: true,
            message: "Acess Denied..! Unauthorized user",
          });
        } else {
          req.user_id = decode.id;
          req.token = token;
          next();
        }
        console.log("user Id:" + decode.id);
      });
    } else {
      res.json({
        error: true,
        message: "Acess Denied..! Unauthorized user",
      });
    }
  },
};
