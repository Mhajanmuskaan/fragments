


const contentType = require('content-type');

const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const { createSuccessResponse, createErrorResponse } = require('../../response');

module.exports = async (req, res) => {
  let type;

  try {
    type = contentType.parse(req).type;
  } catch (err) {
    logger.warn({ err }, 'invalid Content-Type header');
    return res.status(415).json(createErrorResponse(415, 'unsupported media type'));
  }

  if (!Fragment.isSupportedType(type)) {
    logger.warn({ type }, 'unsupported fragment type');
    return res.status(415).json(createErrorResponse(415, 'unsupported media type'));
  }

  if (!Buffer.isBuffer(req.body)) {
    logger.warn({ type }, 'request body was not parsed as a Buffer');
    return res.status(415).json(createErrorResponse(415, 'unsupported media type'));
  }

  logger.info(
  {
    ownerId: req.user,
    type,
    size: req.body.length,
  },
  'Creating fragment'
  );

  const fragment = new Fragment({
    ownerId: req.user,
    type,
  });

  await fragment.setData(req.body);

  logger.debug({ fragment }, 'Fragment created');

  // const location = `${req.protocol}://${req.get('host')}/v1/fragments/${fragment.id}`;

  const apiUrl = process.env.API_URL || `${req.protocol}://${req.headers.host}`;
  const location = new URL(`/v1/fragments/${fragment.id}`, apiUrl).toString();

  res.setHeader('Location', location);

  return res.status(201).json(
    createSuccessResponse({
      fragment,
    })
  );
};