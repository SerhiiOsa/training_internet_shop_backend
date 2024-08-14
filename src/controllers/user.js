const bcrypt = require('bcryptjs');
const { User, Basket, RefreshToken } = require('../../models');
const { createJWT, createRefreshToken } = require('./utils');
const { 
  saltRounds, 
  accessTokenCookie, 
  refreshTokenCookie,
  deleteTokensOptions
} = require('../../config');


const userController = {
  async registration(ctx) {
    const {email, password} = ctx.request.body;

    if (!email || !password) {
      const error = new Error('Email or password is incorrect!');
      error.status = 400;
      throw error;
    }

    const candidate = await User.findOne({where: {email}});
    if (candidate) {
      const error = new Error('User with current email already exists!');
      error.status = 400;
      throw error;
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({email, password: hashedPassword}, {fields: ['email', 'password']});
    const basket = await Basket.create({userId: newUser.id});

    const accessToken = createJWT(newUser.id, email, newUser.role);
    const refreshToken = await createRefreshToken(newUser.id);

    ctx.cookies.set(
      accessTokenCookie.name,
      accessToken,
      accessTokenCookie.options,
    );

    ctx.cookies.set(
      refreshTokenCookie.name,
      refreshToken,
      refreshTokenCookie.options,
    );

    ctx.set('Authorization', `${accessToken}`);
    
    ctx.status = 201;
    ctx.body = {message: 'Registration completed successfuly!'}
  },

  async login(ctx) {
    const {email, password} = ctx.request.body;

    const user = await User.findOne({where: {email}});
    if(!user) {
      const error = new Error('Email or password is incorrect!');
      error.status = 401;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) {
      const error = new Error('Email or password is incorrect!');
      error.status = 401;
      throw error;
    }

    const accessToken = createJWT(user.id, email, user.role);
    const refreshToken = await createRefreshToken(user.id);

    ctx.cookies.set(
      accessTokenCookie.name,
      accessToken,
      accessTokenCookie.options,
    );

    ctx.cookies.set(
      refreshTokenCookie.name,
      refreshToken,
      refreshTokenCookie.options,
    );

    ctx.set('Authorization', `${accessToken}`);

    ctx.status = 200;
    ctx.body = {message: 'Authorization completed successfuly!'}
  },

  async logOut(ctx) {
    const token = ctx.cookies.get(refreshTokenCookie.name);
    if(!token) {
      const error = new Error('Refresh token is missing!');
      error.status = 401;
      throw error;
    }

    await RefreshToken.destroy({where: {token}})

    ctx.cookies.set(accessTokenCookie.name, '', deleteTokensOptions);
    ctx.cookies.set(refreshTokenCookie.name, '', deleteTokensOptions);
    ctx.status = 200;
    ctx.body = {message: "You loged out"};
  }
}

module.exports = userController;
