describe('logger', () => {
  afterEach(() => {
    jest.resetModules();
    jest.dontMock('pino');
    delete process.env.FRAGMENTS_LOG_LEVEL;
  });

  test('uses pino-pretty transport when log level is debug', () => {
    process.env.FRAGMENTS_LOG_LEVEL = 'debug';

    const pino = jest.fn((options) => options);
    jest.doMock('pino', () => pino);

    const logger = require('../../src/logger');

    expect(logger.level).toBe('debug');
    expect(logger.transport).toEqual({
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    });
  });
});