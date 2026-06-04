describe('auth index module', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.dontMock('../../src/auth/cognito');
    jest.dontMock('../../src/auth/basic-auth');
  });

  test('throws error if both Cognito and Basic Auth are configured', () => {
    process.env.AWS_COGNITO_POOL_ID = 'test-pool-id';
    process.env.AWS_COGNITO_CLIENT_ID = 'test-client-id';
    process.env.HTPASSWD_FILE = 'tests/unit/.htpasswd';

    expect(() => require('../../src/auth')).toThrow(
      'env contains configuration for both AWS Cognito and HTTP Basic Auth. Only one is allowed.'
    );
  });

  test('uses Cognito auth when Cognito env vars are configured', () => {
    process.env.AWS_COGNITO_POOL_ID = 'test-pool-id';
    process.env.AWS_COGNITO_CLIENT_ID = 'test-client-id';
    delete process.env.HTPASSWD_FILE;

    jest.doMock('../../src/auth/cognito', () => 'cognito-auth');

    const auth = require('../../src/auth');

    expect(auth).toBe('cognito-auth');
  });

  test('uses Basic Auth when HTPASSWD_FILE is configured outside production', () => {
    delete process.env.AWS_COGNITO_POOL_ID;
    delete process.env.AWS_COGNITO_CLIENT_ID;
    process.env.HTPASSWD_FILE = 'tests/unit/.htpasswd';
    process.env.NODE_ENV = 'test';

    jest.doMock('../../src/auth/basic-auth', () => 'basic-auth');

    const auth = require('../../src/auth');

    expect(auth).toBe('basic-auth');
  });

  test('throws error if no auth configuration is found', () => {
    delete process.env.AWS_COGNITO_POOL_ID;
    delete process.env.AWS_COGNITO_CLIENT_ID;
    delete process.env.HTPASSWD_FILE;

    expect(() => require('../../src/auth')).toThrow(
      'missing env vars: no authorization configuration found'
    );
  });
});