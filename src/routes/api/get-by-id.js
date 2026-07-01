// const { Fragment } = require('../../model/fragment');
// const { createErrorResponse } = require('../../response');
// const logger = require('../../logger');

// module.exports = async (req, res) => {
//   const { id } = req.params;

//   const match = id.match(/^(.+?)(\.[^.]+)?$/);
//   const fragmentId = match[1];
//   const extension = match[2];

//   logger.info(
//     {
//       ownerId: req.user,
//       id: fragmentId,
//     },
//     'Getting fragment by id'
//   );

//   let fragment;

//   try {
//     fragment = await Fragment.byId(req.user, fragmentId);
//   } catch {
//     logger.warn(
//       {
//         ownerId: req.user,
//         id: fragmentId,
//       },
//       'Fragment not found'
//     );

//     return res.status(404).json(createErrorResponse(404, 'fragment not found'));
//   }

//   if (extension && extension !== '.txt') {
//     logger.warn({ extension }, 'Unsupported fragment extension');

//     return res.status(415).json(createErrorResponse(415, 'unsupported media type'));
//   }

//   logger.debug(
//     {
//       id: fragment.id,
//       type: fragment.type,
//       size: fragment.size,
//     },
//     'Fragment found'
//   );

//   const data = await fragment.getData();

//   res.setHeader('Content-Type', fragment.type);

//   return res.status(200).send(data);
// };




const MarkdownIt = require('markdown-it');

const { Fragment } = require('../../model/fragment');
const { createErrorResponse } = require('../../response');
const logger = require('../../logger');

const markdown = new MarkdownIt();

const extensionTypes = {
  '.txt': 'text/plain',
  '.md': 'text/markdown',
  '.html': 'text/html',
  '.json': 'application/json',
};

const parseIdAndExtension = (id) => {
  const match = id.match(/^(.+?)(\.[^.]+)?$/);

  return {
    fragmentId: match[1],
    extension: match[2],
  };
};

module.exports = async (req, res) => {
  const { fragmentId, extension } = parseIdAndExtension(req.params.id);

  logger.info(
    {
      ownerId: req.user,
      id: fragmentId,
      extension,
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

  const data = await fragment.getData();

  if (!extension) {
    res.setHeader('Content-Type', fragment.type);
    return res.status(200).send(data);
  }

  const requestedType = extensionTypes[extension];

  if (!requestedType) {
    logger.warn({ extension }, 'Unsupported fragment extension');
    return res.status(415).json(createErrorResponse(415, 'unsupported media type'));
  }

  if (fragment.mimeType === requestedType) {
    res.setHeader('Content-Type', requestedType);
    return res.status(200).send(data);
  }

  if (extension === '.txt' && (fragment.isText || fragment.mimeType === 'application/json')) {
    res.setHeader('Content-Type', 'text/plain');
    return res.status(200).send(data.toString());
  }

  if (fragment.mimeType === 'text/markdown' && extension === '.html') {
    const html = markdown.render(data.toString());

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(html);
  }

  logger.warn(
    {
      sourceType: fragment.mimeType,
      requestedType,
      extension,
    },
    'Unsupported fragment conversion'
  );

  return res.status(415).json(createErrorResponse(415, 'unsupported media type'));
};