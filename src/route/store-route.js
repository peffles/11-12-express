'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import Store from '../model/store';
import logger from '../lib/logger';

const parser = bodyParser.json();

const storeRouter = new Router();

storeRouter.post('/api/v1/stores', parser, (request, response) => {
  logger.log(logger.INFO, 'POST - processing a request');
  if (!request.body.name || !request.body.location) {
    logger.log(logger.INFO, 'Responding with a 400 error code');
    return response.sendStatus(400);
  }
  return new Store(request.body).save()
    .then((store) => {
      logger.log(logger.INFO, 'POST - responding with a 200 status code');
      logger.log(logger.INFO, store);
      return response.json(store);
    })
    .catch((error) => {
      logger.log(logger.ERROR, '__POST_ERROR__');
      logger.log(logger.ERROR, error);
      return response.sendStatus(500);
    });
});

storeRouter.get('/api/v1/stores/:id', (request, response) => {
  logger.log(logger.INFO, 'GET - processing a request');

  return Store.findById(request.params.id)
    .then((store) => {
      if (!store) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code');
        return response.sendStatus(404);
      }
      logger.log(logger.INFO, 'GET - responding with a 200 status code');
      return response.json(store);
    })
    .catch((error) => { 
      if (error.message.toLowerCase().indexOf('cast to objectid failed') > -1) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - objectId');
        logger.log(logger.VERBOSE, `Could not parse the specific object id ${request.params.id}`);
        response.sendStatus(404);
      }
      logger.log(logger.ERROR, '__GET_ERROR__ Returning a 500 status code');
      logger.log(logger.ERROR, error);
      return undefined;
    });
});

storeRouter.get('/api/v1/stores', (request, response) => {
  logger.log(logger.INFO, 'GET ALL - processing a request for all stores');

  return Store.find()
    .then((stores) => {
      if (!stores) {
        logger.log(logger.INFO, 'GET ALL - responding with a 404 status code');
        return response.sendStatus(404);
      }
      logger.log(logger.INFO, 'GET ALL - responding with a 200 status code');
      return response.json(stores.map(store => store.name));
    })
    .catch((error) => { // mongodb error or parsing id error
      if (error) {
        logger.log(logger.INFO, 'GET ALL - responding with a 404 status code');
        response.sendStatus(404);
      }
      logger.log(logger.ERROR, '__GET_ALL_ERROR__ Returning a 500 status code');
      logger.log(logger.ERROR, error);
      return undefined;
    });
});

storeRouter.delete('/api/v1/stores/:id', (request, response) => {
  logger.log(logger.INFO, 'DELETE - processing a request');

  return Store.findByIdAndRemove(request.params.id)
    .then((store) => {
      if (!store) {
        logger.log(logger.INFO, 'DELETE - responding with a 404 status code');
        return response.sendStatus(404);
      }
      logger.log(logger.INFO, 'DELETE - responding with a 200 status code');
      return response.json(`${store.name} has been deleted`);
    })
    .catch((error) => { // mongodb error or parsing id error
      if (error.message.toLowerCase().indexOf('cast to objectid failed') > -1) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - objectId');
        logger.log(logger.VERBOSE, `Could not parse the specific object id ${request.params.id}`);
        response.sendStatus(404);
      }
      logger.log(logger.ERROR, '__GET_ERROR__ Returning a 500 status code');
      logger.log(logger.ERROR, error);
      return undefined;
    });
});

export default storeRouter;
