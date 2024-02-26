import('chalk').then(({default: chalk}) => {
  require('dotenv').config();
  const mongoose = require('mongoose');

  const app = require('./src/app');

  let {MONGO_URI} = process.env;
  if (process.env.MONGO == 'LOCAL') {
    MONGO_URI = process.env.MONGO_URI_LOCAL;
  }

  if (process.env.APISECURE == 'FALSE' && process.env.ENV == 'production') {
    console.log(
        chalk.red('WARNING: APISECURE set to FALSE in production ☢️ ☣️ 🔓!'),
    );
  } else if (process.env.APISECURE == 'FALSE') {
    console.log(chalk.yellow('WARNING: APISECURE set to FALSE 🔓 !'));
  } else {
    console.log(chalk.green('INFO: APISECURE set to TRUE 🔐 !'));
  }

  try {
    mongoose.connect(MONGO_URI);
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Sever started on ${PORT} 🎉🎉🎉`);
    });
  } catch (error) {
    console.log(error);
  }
});
