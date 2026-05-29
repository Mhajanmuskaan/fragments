const { Fragment } = require('../../model/fragment');
const { createErrorResponse } = require('../../response');

module.exports = async (req, res) => {
  const { id } = req.params;

  const match = id.match(/^(.+?)(\.[^.]+)?$/);
  const fragmentId = match[1];
  const extension = match[2];

  // const fragment = await Fragment.byId(req.user, fragmentId);

  // if (!fragment) {
  //   return res.status(404).json(createErrorResponse(404, 'fragment not found'));
  // }

  let fragment;

  try {
    fragment = await Fragment.byId(req.user, fragmentId);
  } catch {
    return res.status(404).json(createErrorResponse(404, 'fragment not found'));
  }


  if (extension && extension !== '.txt') {
    return res.status(415).json(createErrorResponse(415, 'unsupported media type'));
  }

  const data = await fragment.getData();

  res.setHeader('Content-Type', fragment.type);

  return res.status(200).send(data);
};