const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');

module.exports = async (req, res) => {
  const type = req.get('Content-Type');

  if (!Fragment.isSupportedType(type)) {
    return res.status(415).json(createErrorResponse(415, 'unsupported media type'));
  }

  if (!req.body || typeof req.body !== 'string') {
    return res.status(400).json(createErrorResponse(400, 'invalid request'));
  }

  const fragment = new Fragment({
    ownerId: req.user,
    type: 'text/plain',
  });

  await fragment.setData(Buffer.from(req.body));

  const location = `${req.protocol}://${req.get('host')}/v1/fragments/${fragment.id}`;

  res.setHeader('Location', location);

  return res.status(201).json(
    createSuccessResponse({
      fragment,
    })
  );
};