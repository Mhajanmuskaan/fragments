const request = require('supertest');

const app = require('../../src/app');

const auth = (req) =>
  req.auth('test-user1@fragments-testing.com', 'test-password1');

describe('PUT /v1/fragments/:id', () => {
  test('unauthenticated requests are denied', () =>
    request(app)
      .put('/v1/fragments/some-id')
      .set('Content-Type', 'text/plain')
      .send('updated')
      .expect(401));

  test('returns 404 for an unknown fragment id', async () => {
    const res = await auth(
      request(app)
        .put('/v1/fragments/does-not-exist')
        .set('Content-Type', 'text/plain')
        .send('updated')
    );

    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.error.code).toBe(404);
  });

  test('returns 415 for an unsupported content type', async () => {
    const createRes = await auth(
      request(app)
        .post('/v1/fragments')
        .set('Content-Type', 'text/plain')
        .send('original')
    );

    const res = await auth(
      request(app)
        .put(`/v1/fragments/${createRes.body.fragment.id}`)
        .set('Content-Type', 'application/xml')
        .send('<updated />')
    );

    expect(res.statusCode).toBe(415);
    expect(res.body.status).toBe('error');
    expect(res.body.error.code).toBe(415);
  });

  test('returns 400 when attempting to change the fragment type', async () => {
    const createRes = await auth(
      request(app)
        .post('/v1/fragments')
        .set('Content-Type', 'text/plain')
        .send('original')
    );

    const res = await auth(
      request(app)
        .put(`/v1/fragments/${createRes.body.fragment.id}`)
        .set('Content-Type', 'application/json')
        .send('{"updated":true}')
    );

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe('error');
    expect(res.body.error.code).toBe(400);
  });

  test('updates an existing fragment and returns its metadata', async () => {
    const createRes = await auth(
      request(app)
        .post('/v1/fragments')
        .set('Content-Type', 'text/plain')
        .send('original')
    );

    const id = createRes.body.fragment.id;
    const updatedData = 'updated fragment data';

    const putRes = await auth(
      request(app)
        .put(`/v1/fragments/${id}`)
        .set('Content-Type', 'text/plain')
        .send(updatedData)
    );

    expect(putRes.statusCode).toBe(200);
    expect(putRes.body.status).toBe('ok');
    expect(putRes.body.fragment.id).toBe(id);
    expect(putRes.body.fragment.type).toBe('text/plain');
    expect(putRes.body.fragment.size).toBe(Buffer.byteLength(updatedData));

    const getRes = await auth(request(app).get(`/v1/fragments/${id}`));

    expect(getRes.statusCode).toBe(200);
    expect(getRes.text).toBe(updatedData);
  });
});