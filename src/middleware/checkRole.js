const jwt = require("jsonwebtoken");
const { accessTokenCookie } = require('../../config');

module.exports = (role) => {
  return async (ctx, next) => {
    let accessToken = ctx.cookies.get(accessTokenCookie.name);
  
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    if(decoded.role !== role ) {
      const error = new Error("You have no access!");
      error.status = 403;
      throw error;
    }
    await next();
  }
}
