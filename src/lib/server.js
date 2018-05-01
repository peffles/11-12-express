'use strict';

import express from 'express';
import mongoose from 'mongoose';
import logger from './logger';
import routes from '../route/store-route';

const app = express();
let server = null;

app.use(routes);

app.all('*', (request, response) => {
  logger.log(logger.INFO, 'Returning a 404');
  return response.sendStatus(404);
});

const serverStart = () => {
  return mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      server = app.listen(process.env.PORT, () => {
        logger.log(logger.INFO, `Server is listening on port ${process.env.PORT}`);
      });
    });
};

const serverStop = () => {
  return mongoose.disconnect()
    .then(() => {
      server.close(() => {
        logger.log(logger.INFO, 'Server is offline');
      });
    });
};

export { serverStart, serverStop };
