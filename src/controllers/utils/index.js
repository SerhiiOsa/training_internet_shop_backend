const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const fs = require("fs").promises;
const path = require("path");
const { RefreshToken } = require('../../../models');
const { accessTokenExpiresIn } = require('../../../config');

module.exports = {
  async sendData(data, ctx) {
    if (data) {
      ctx.status = 200;
      ctx.body = data;
    } else {
      ctx.status = 500;
      ctx.body = { error: "Internal server error." };
    }
  },

  createJWT(id, email, role) {
    return accessToken = jwt.sign(
      {id, email, role}, 
      process.env.JWT_SECRET, 
      {expiresIn: accessTokenExpiresIn}
    )
  },

  async createRefreshToken(id) {
    const refreshToken = uuidv4();
    await RefreshToken.upsert({userId: id, token: refreshToken});

    return refreshToken;
  },

  async updateRefreshToken(currentToken) {
    const refreshToken = uuidv4();
    await RefreshToken.update({token: refreshToken}, {where: {token: currentToken}});

    return refreshToken;
  },

  async removeImage(image) {
    const subfolder = path.dirname(path.join('public', image));
  
    await fs.unlink(path.join('public', image));
  
    const subfolderStats = await fs.stat(subfolder);
  
    if (
      subfolderStats.isDirectory() &&
      (await fs.readdir(subfolder)).length === 0
    ) {
      await fs.rmdir(subfolder);
    }
  },

  assertItemExists(item) {
    if (!item) {
      const error = new Error("This item does not exist.");
      error.status = 400;
      throw error;
    }
  },

  toPluralUkrainianWords(word) {
    if (!word || typeof word !== 'string') return word;
  
    const lastChar = word.slice(-1);
    const secondLastChar = word.slice(-2, -1);
  
    // Закінчення на "а", "я"
    if (['а', 'я'].includes(lastChar)) {
      return word.slice(0, -1) + 'и';
    }
    
    // Закінчення на "о"
    if (lastChar === 'о') {
      return word.slice(0, -1) + 'а';
    }
  
    // Закінчення на "е", "є"
    if (['е', 'є'].includes(lastChar)) {
      return word.slice(0, -1) + 'я';
    }
  
    // Закінчення на "ий", "ій", "ок"
    if (lastChar === 'й' && ['и', 'і'].includes(secondLastChar)) {
      return word.slice(0, -2) + 'ї';
    }
  
    if (word.endsWith('ок')) {
      return word.slice(0, -2) + 'ки';
    }
  
    // Закінчення на приголосні
    if (!['а', 'я', 'о', 'е', 'є', 'й'].includes(lastChar)) {
      return word + 'и';
    }
  
    return word;
  }
}