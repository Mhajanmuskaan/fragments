const { Fragment } = require('../../model/fragment');
const { createErrorResponse } = require('../../response');
const logger = require('../../logger');

module.exports = async (req, res) => {
  const { id } = req.params;

  const match = id.match(/^(.+?)(\.[^.]+)?$/);
  const fragmentId = match[1];
  const extension = match[2];

  logger.info(
    {
      ownerId: req.user,
      id: fragmentId,
    },
    'Getting fragment by id'
  );

  let fragment;

  try {
    fragment = await Fragment.byId(req.user, fragmentId);
  } catch {
    logger.warn(
      {
        ownerId: req.user,
        id: fragmentId,
      },
      'Fragment not found'
    );

    return res.status(404).json(createErrorResponse(404, 'fragment not found'));
  }

  if (extension && extension !== '.txt') {
    logger.warn({ extension }, 'Unsupported fragment extension');

    return res.status(415).json(createErrorResponse(415, 'unsupported media type'));
  }

  logger.debug(
    {
      id: fragment.id,
      type: fragment.type,
      size: fragment.size,
    },
    'Fragment found'
  );

  const data = await fragment.getData();

  res.setHeader('Content-Type', fragment.type);

  return res.status(200).send(data);
};