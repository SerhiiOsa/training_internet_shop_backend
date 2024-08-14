const jwt = require("jsonwebtoken");
const { accessTokenCookie } = require('../../config');
const { refreshAccessToken } = require('./utils');

module.exports =  async (ctx, next) => {
  const accessToken = ctx.cookies.get(accessTokenCookie.name);

  if(!accessToken) {
    return await refreshAccessToken(ctx);
  }

  const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
  if(decoded) {
    ctx.status = 200;
    ctx.body = {message: "success"}
  }
  await next();
}