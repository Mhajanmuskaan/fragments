const request = require('supertest');

const app = require('../../src/app');

describe('404 middleware', () => {
  test('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/unknown');

    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.error.code).toBe(404);
    expect(res.body.error.message).toBe('not found');
  });
});

describe('error middleware', () => {
  test('returns 500 when a route throws an error', async () => {
    jest.resetModules();

    jest.doMock('../../src/routes', () => {
      const express = require('express');
      const router = express.Router();

      router.get('/boom', (req, res, next) => {
        next(new Error('test error'));
      });

      return router;
    });

    const request = require('supertest');
    const app = require('../../src/app');

    const res = await request(app).get('/boom');

    expect(res.statusCode).toBe(500);
    expect(res.body.status).toBe('error');
    expect(res.body.error.code).toBe(500);
    expect(res.body.error.message).toBe('test error');

    jest.dontMock('../../src/routes');
  });
});