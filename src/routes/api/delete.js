const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');

const parseIdAndExtension = (id) => {
  const match = id.match(/^(.+?)(\.[^.]+)?$/);

  return {
    fragmentId: match[1],
  };
};

module.exports = async (req, res) => {
  const { fragmentId } = parseIdAndExtension(req.params.id);

  logger.info(
    {
      ownerId: req.user,
      id: fragmentId,
    },
    'Deleting fragment'
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

  try {
    await fragment.delete();

    return res.status(200).json(createSuccessResponse());
  } catch (err) {
    logger.error(
      {
        err,
        ownerId: req.user,
        id: fragmentId,
      },
      'Unable to delete fragment'
    );

    return res.status(500).json(createErrorResponse(500, 'unable to delete fragment'));
  }
};
