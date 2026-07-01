const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');

module.exports = async (req, res) => {
  const { id } = req.params;

  logger.info({ ownerId: req.user, id }, 'Getting fragment metadata');

  try {
    const fragment = await Fragment.byId(req.user, id);

    return res.status(200).json(
      createSuccessResponse({
        fragment,
      })
    );
  } catch {
    logger.warn({ ownerId: req.user, id }, 'Fragment metadata not found');

    return res.status(404).json(createErrorResponse(404, 'fragment not found'));
  }
};