module.exports = {
  saltRounds: 5,
  accessTokenExpiresIn: "10m",
  
  corsOptions: {
    credentials: true,
    exposeHeaders: ['Authorization'],
    origin: process.env.CLIENT_URL,
  },

  accessTokenCookie: {
    name: "accessToken",
    options: {
      httpOnly: true,
      domain: 'localhost',
      path: '/',
      signed: true,
      maxAge: 600000, //10 minutes
    },
  },
  refreshTokenCookie: {
    name: "refreshToken",
    options: {
      httpOnly: true,
      domain: 'localhost',
      path: '/',
      signed: true,
      maxAge: 3600000, //60 minutes
    },
  },
  deleteTokensOptions: {
    httpOnly: true,
    domain: 'localhost',
    path: '/',
    signed: true,
    maxAge: 0
  }
}