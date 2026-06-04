

const request = require('supertest');

const app = require('../../src/app');

describe('POST /v1/fragments', () => {
  test('unauthenticated requests are denied', () =>
    request(app).post('/v1/fragments').send(Buffer.from('hello')).expect(401));

  test('authenticated users can create a text/plain fragment', async () => {
    const data = Buffer.from('This is a fragment');

    const res = await request(app)
      .post('/v1/fragments')
      .auth('test-user1@fragments-testing.com', 'test-password1')
      .set('Content-Type', 'text/plain')
      .send(data);

    expect(res.statusCode).toBe(201);
    expect(res.headers.location).toBeDefined();
    expect(res.headers.location).toMatch(/\/v1\/fragments\/.+/);

    expect(res.body.status).toBe('ok');
    expect(res.body.fragment).toBeDefined();
    expect(res.body.fragment.id).toBeDefined();
    expect(res.body.fragment.ownerId).toBeDefined();
    expect(res.body.fragment.created).toBeDefined();
    expect(res.body.fragment.updated).toBeDefined();
    expect(res.body.fragment.type).toBe('text/plain');
    expect(res.body.fragment.size).toBe(data.length);
  });

  test('POST response Location header uses API_URL when set', async () => {
    const originalApiUrl = process.env.API_URL;
    process.env.API_URL = 'http://api.example.com';

    const res = await request(app)
      .post('/v1/fragments')
      .auth('test-user1@fragments-testing.com', 'test-password1')
      .set('Content-Type', 'text/plain')
      .send(Buffer.from('hello'));

    expect(res.statusCode).toBe(201);
    expect(res.headers.location).toMatch(/^http:\/\/api\.example\.com\/v1\/fragments\/.+/);

    if (originalApiUrl) {
      process.env.API_URL = originalApiUrl;
    } else {
      delete process.env.API_URL;
    }
  });

  test('unsupported content type returns 415', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('test-user1@fragments-testing.com', 'test-password1')
      .set('Content-Type', 'application/json')
      .send(Buffer.from('{"hello":"world"}'));

    expect(res.statusCode).toBe(415);
    expect(res.body.status).toBe('error');
    expect(res.body.error.code).toBe(415);
  });
});

test('missing Content-Type returns 415', async () => {
  const res = await request(app)
    .post('/v1/fragments')
    .auth('test-user1@fragments-testing.com', 'test-password1')
    .send(Buffer.from('hello'));

  expect(res.statusCode).toBe(415);
  expect(res.body.status).toBe('error');
  expect(res.body.error.code).toBe(415);
});

test('request body that is not a Buffer returns 415', async () => {
  const postHandler = require('../../src/routes/api/post');

  const req = {
    user: 'test-user',
    body: 'not-a-buffer',
    headers: {
      'content-type': 'text/plain',
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await postHandler(req, res);

  expect(res.status).toHaveBeenCalledWith(415);
  expect(res.json).toHaveBeenCalledWith({
    status: 'error',
    error: {
      code: 415,
      message: 'unsupported media type',
    },
  });
});

