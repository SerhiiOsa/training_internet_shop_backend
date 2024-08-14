const db = require('./models');

module.exports = async (app) => {
  try {
    await db.sequelize.sync();
    console.log('All models were synchronized successfully.');

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on http://${process.env.HOST}:${process.env.PORT}`);
    });
  } catch (error) {
    console.error('Unable to synchronize the models:', error);
  }
};