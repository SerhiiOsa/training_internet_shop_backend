module.exports = async(ctx, next) => {
  try {
    await next();
  } catch (error) {
    console.error('Error: ', error);

    if(error.message === 'jwt must be provided') {
      ctx.status = 401;
    }else {
      ctx.status = error.statusCode || error.status || 500;
    }
    
    ctx.body = {error: error.message || "Internal server error"};
  }
}