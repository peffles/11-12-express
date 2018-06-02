'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpErrors from 'http-errors';
import Store from '../model/store';
import logger from '../lib/logger';

const jsonParser = bodyParser.json();

const storeRouter = new Router();

storeRouter.post('/api/v1/stores', jsonParser, (request, response, next) => {
  if (!request.body.name || !request.body.location) {
    logger.log(logger.INFO, 'Responding with a 400 error code');
    return next(new HttpErrors(400, 'name and location are required'));
  }
  return new Store(request.body).save()
    .then((store) => {
      logger.log(logger.INFO, 'POST - responding with a 200 status code');
      logger.log(logger.INFO, store);
      return response.json(store);
    })
    .catch(next);
});

storeRouter.get('/api/v1/stores/:id', (request, response, next) => {
  return Store.findById(request.params.id)
    .then((store) => {
      if (!store) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - (!store)');
        return next(new HttpErrors(404));
      }
      logger.log(logger.INFO, 'GET - responding with a 200 status code');
      return response.json(store);
    })
    .catch(next);
});

// GET all
storeRouter.get('/api/v1/stores', (request, response, next) => {
  return Store.find()
    .then((stores) => {
      if (!stores) {
        logger.log(logger.INFO, 'GET ALL - responding with a 404 status code - (!stores)');
        return next(new HttpErrors(404, 'No stores found'));
      }
      logger.log(logger.INFO, 'GET ALL - responding with a 200 status code');
      return response.json(stores.map(store => store.name));
    })
    .catch(next);
});

storeRouter.put('/api/v1/stores/:id', jsonParser, (request, response, next) => {
  const options = { runValidators: true, new: true };
  return Store.findByIdAndUpdate(request.params.id, request.body, options)
    .then((updatedStore) => {
      if (!updatedStore) {
        logger.log(logger.INFO, 'PUT - responding with a 404 status code- (!updatedStore)');
        return next(new HttpErrors(404, 'store not found'));
      }
      logger.log(logger.INFO, 'PUT - responding with a 200 status code');
      return response.json(updatedStore);
    })
    .catch(next);
});

storeRouter.delete('/api/v1/stores/:id', (request, response, next) => {
  return Store.findByIdAndRemove(request.params.id)
    .then((store) => {
      if (!store) {
        logger.log(logger.INFO, 'DELETE - responding with a 404 status code - (!store)');
        return next(new HttpErrors(404));
      }
      logger.log(logger.INFO, 'DELETE - responding with a 200 status code');
      return response.sendStatus(204);
    })
    .catch(next);
});

export default storeRouter;
