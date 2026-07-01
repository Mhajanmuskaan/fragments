const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments/:id/info', () => {
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/some-id/info').expect(401));

  test('returns 404 for unknown fragment id', async () => {
    const res = await request(app)
      .get('/v1/fragments/does-not-exist/info')
      .auth('test-user1@fragments-testing.com', 'test-password1');

    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.error.code).toBe(404);
  });

  test('authenticated user can get metadata for an existing fragment', async () => {
    const data = 'hello';

    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('test-user1@fragments-testing.com', 'test-password1')
      .set('Content-Type', 'text/plain')
      .send(data);

    const id = postRes.body.fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${id}/info`)
      .auth('test-user1@fragments-testing.com', 'test-password1');

    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.status).toBe('ok');
    expect(getRes.body.fragment.id).toBe(id);
    expect(getRes.body.fragment.ownerId).toBeDefined();
    expect(getRes.body.fragment.created).toBeDefined();
    expect(getRes.body.fragment.updated).toBeDefined();
    expect(getRes.body.fragment.type).toBe('text/plain');
    expect(getRes.body.fragment.size).toBe(Buffer.byteLength(data));
  });
});