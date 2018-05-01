'use strict';

import faker from 'faker';
import superagent from 'superagent';
import Store from '../model/store';
import { serverStart, serverStop } from '../lib/server';

const URL = `http://localhost:${process.env.PORT}/api/v1/stores`;

const createMockStore = () => {
  return new Store({
    name: faker.lorem.words(10),
    location: faker.lorem.words(20),
    brands: faker.lorem.words(12),
  }).save();
};

describe('/api/v1/store', () => {
  beforeAll(serverStart);
  afterAll(serverStop);
  afterEach(() => Store.remove({}));
  test('POST - It should respond with a status code of 200', () => {
    const storePost = {
      name: faker.lorem.words(1),
      location: faker.lorem.words(2),
      brands: faker.lorem.words(2),
    };
    return superagent.post(URL)
      .send(storePost)
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.name).toEqual(storePost.name);
        expect(response.body.location).toEqual(storePost.location);
        expect(response.body.brands).toEqual(storePost.brands);
        expect(response.body._id).toBeTruthy();
        expect(response.body.timestamp).toBeTruthy();
      });
  });
  test('POST - it should respond with a status of 400.', () => {
    const storePost = {
      location: faker.lorem.words(2),
    };
    return superagent.post(URL)
      .send(storePost)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });
  describe('GET /api/v1/stores', () => {
    test('should respond with 200 if there are no errors', () => {
      let storeTest = null;
      return createMockStore()
        .then((store) => {
          storeTest = store;
          return superagent.get(`${URL}/${store.id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.name).toEqual(storeTest.name);
          expect(response.body.location).toEqual(storeTest.location);
          expect(response.body.brands).toEqual(storeTest.brands);
        });
    });
    test('should respond with 404 status code if there is no store to be found', () => {
      return superagent.get(`${URL}/ThisIsAnInvalidId`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });
});
