'use strict';

import faker from 'faker';
import superagent from 'superagent';
import Store from '../model/store';
import { startServer, stopServer } from '../lib/server';

const apiURL = `http://localhost:${process.env.PORT}/api/v1/stores`;

const createMockStore = () => {
  return new Store({
    name: faker.lorem.words(10),
    location: faker.lorem.words(20),
    brands: faker.lorem.words(12),
  }).save();
};

const createManyMocks = (howManyStores) => {
  return Promise.all(new Array(howManyStores)
    .fill(0)
    .map(() => createMockStore()));
};

describe('/api/v1/stores', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(() => Store.remove({}));
  test('POST - It should respond with a 200 status', () => {
    const storeToPost = {
      name: faker.lorem.words(1),
      location: faker.lorem.words(2),
      brands: faker.lorem.words(2),
    };
    return superagent.post(apiURL)
      .send(storeToPost)
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.name).toEqual(storeToPost.name);
        expect(response.body.location).toEqual(storeToPost.location);
        expect(response.body.brands).toEqual(storeToPost.brands);
        expect(response.body._id).toBeTruthy();
        expect(response.body.timestamp).toBeTruthy();
      });
  });
  test('POST - it shoudl respond with a 400 status', () => {
    const storeToPost = {
      location: faker.lorem.words(2),
    };
    return superagent.post(apiURL)
      .send(storeToPost)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });
  describe('GET /api/v1/stores', () => {
    test('should respond with 200 if there are no errors', () => {
      let storeToTest = null;
      return createMockStore()
        .then((store) => {
          storeToTest = store;
          return superagent.get(`${apiURL}/${store.id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.name).toEqual(storeToTest.name);
          expect(response.body.location).toEqual(storeToTest.location);
          expect(response.body.brands).toEqual(storeToTest.brands);
        });
    });
    test('should respond with 404 if there is no store to be found', () => {
      return superagent.get(`${apiURL}/InvalidId`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });
  
  describe('GET ALL /api/v1/stores', () => {
    test('should respond with 200 if there are no errors', () => {
      let storesToTest = null;
      return createManyMocks(10)
        .then((stores) => {
          storesToTest = stores;
          return superagent.get(apiURL);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body).toBeTruthy();
          expect(response.body).toHaveLength(storesToTest.length);
        });
    });
    test('should respond with 404 if there are no stores to be found', () => {
      return superagent.get(`${apiURL}/noStores`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });

  describe('PUT /api/v1/stores', () => {
    test('should update a store and return a 200 status code', () => {
      let storeToUpdate = null;
      return createMockStore()
        .then((storeMock) => {
          storeToUpdate = storeMock;
          return superagent.put(`${apiURL}/${storeMock._id}`)
            .send({ name: 'coolStore', location: 'Seattle' });
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.name).toEqual('coolStore');
          expect(response.body.location).toEqual('Seattle');
          expect(response.body.brands).toEqual(storeToUpdate.brands);
          expect(response.body._id).toEqual(storeToUpdate._id.toString());
        });
    });
    test('should respond with 404 if there is no store to be updated', () => {
      return superagent.get(`${apiURL}/InvalidId`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });

  describe('DELETE /api/v1/stores', () => {
    test('should delete a store and return a 200 status code', () => {
      return createMockStore()
        .then((store) => {
          return superagent.delete(`${apiURL}/${store.id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(204);
        });
    });
    test('should respond with 404 if there is no store to be deleted', () => {
      return superagent.get(`${apiURL}/InvalidId`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });
});
