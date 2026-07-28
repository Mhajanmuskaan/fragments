const contentType = require('content-type');

const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const { createSuccessResponse, createErrorResponse } = require('../../response');

module.exports = async (req, res) => {
  const { id } = req.params;

  let type;

  try {
    type = contentType.format(contentType.parse(req));
  } catch (err) {
    logger.warn({ err, id }, 'Invalid Content-Type header');
    return res.status(415).json(createErrorResponse(415, 'unsupported media type'));
  }

  if (!Fragment.isSupportedType(type) || !Buffer.isBuffer(req.body)) {
    logger.warn({ id, type }, 'Unsupported fragment type');
    return res.status(415).json(createErrorResponse(415, 'unsupported media type'));
  }

  let fragment;

  try {
    fragment = await Fragment.byId(req.user, id);
  } catch {
    logger.warn({ ownerId: req.user, id }, 'Fragment not found');
    return res.status(404).json(createErrorResponse(404, 'fragment not found'));
  }

  if (type !== fragment.type) {
    logger.warn(
      {
        ownerId: req.user,
        id,
        currentType: fragment.type,
        requestedType: type,
      },
      'Cannot change fragment type'
    );

    return res.status(400).json(createErrorResponse(400, 'fragment type cannot be changed'));
  }

  try {
    await fragment.setData(req.body);

    return res.status(200).json(
      createSuccessResponse({
        fragment,
      })
    );
  } catch (err) {
    logger.error({ err, ownerId: req.user, id }, 'Unable to update fragment');
    return res.status(500).json(createErrorResponse(500, 'unable to update fragment'));
  }
};