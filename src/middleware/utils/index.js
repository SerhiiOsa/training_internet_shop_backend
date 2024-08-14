const { createJWT, updateRefreshToken } = require('../../controllers/utils');
const { accessTokenCookie, refreshTokenCookie } = require('../../../config');
const { RefreshToken, User } = require('../../../models');

module.exports = {
  async refreshAccessToken(ctx) {
    const refreshToken = ctx.cookies.get(refreshTokenCookie.name);
    if (!refreshToken) {
      const error = new Error("Refresh token is missing or not valid. Plese sign in!");
      error.status = 401;
      throw error;
    }
  
    const refreshTokenData = await RefreshToken.findOne({where: {token: refreshToken}});
    if(!refreshTokenData) {
      const error = new Error("Refresh token is missing or not valid. Plese sign in!");
      error.status = 401;
      throw error;
    }
  
    const currentTimestamp = new Date();
    const RefreshTokenUpdatedAt = new Date(refreshTokenData.updatedAt);
    const refreshTokenExpiresAt = new Date(RefreshTokenUpdatedAt.getTime() + refreshTokenCookie.options.maxAge);
    if (refreshTokenExpiresAt < currentTimestamp) {
      const error = new Error("Refresh token is missing or not valid. Plese sign in!");
      error.status = 401;
      throw error;
    }
  
    const user = await User.findOne({where: {id: refreshTokenData.userId}});
    if(!user) {
      const error = new Error("User does not exist. Please sign in!");
      error.status = 401;
      throw error;
    }
  
    const newAccessToken = createJWT(user.id, user.email, user.role);
    const newRefreshToken = await updateRefreshToken(refreshTokenData.token);
  
    ctx.cookies.set(
      accessTokenCookie.name,
      newAccessToken,
      accessTokenCookie.options,
    );
  
    ctx.cookies.set(
      refreshTokenCookie.name,
      newRefreshToken,
      refreshTokenCookie.options,
    );

    ctx.set('Authorization', `${newAccessToken}`);
    ctx.status = 401;
    ctx.body = {
      "message": "Access token was successfully refreshed. Please retry your request with the new token."
    }
  }
}