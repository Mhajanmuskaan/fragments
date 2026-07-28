const MarkdownIt = require('markdown-it');
const sharp = require('sharp');

const { Fragment } = require('../../model/fragment');
const { createErrorResponse } = require('../../response');
const logger = require('../../logger');

const markdown = new MarkdownIt();

const extensionTypes = {
  '.txt': 'text/plain',
  '.md': 'text/markdown',
  '.html': 'text/html',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
};

const imageFormats = {
  '.png': 'png',
  '.jpg': 'jpeg',
  '.jpeg': 'jpeg',
  '.webp': 'webp',
  '.avif': 'avif',
  '.gif': 'gif',
};

const parseIdAndExtension = (id) => {
  const match = id.match(/^(.+?)(\.[^.]+)?$/);

  return {
    fragmentId: match[1],
    extension: match[2]?.toLowerCase(),
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

  if (!fragment.formats.includes(requestedType)) {
    logger.warn(
      {
        sourceType: fragment.mimeType,
        requestedType,
      },
      'Unsupported fragment conversion'
    );

    return res.status(415).json(createErrorResponse(415, 'unsupported media type'));
  }

  if (fragment.mimeType === requestedType) {
    res.setHeader('Content-Type', requestedType);
    return res.status(200).send(data);
  }

  if (
    extension === '.txt' &&
    (fragment.isText || fragment.mimeType === 'application/json')
  ) {
    res.setHeader('Content-Type', 'text/plain');
    return res.status(200).send(data.toString());
  }

  if (fragment.mimeType === 'text/markdown' && extension === '.html') {
    const html = markdown.render(data.toString());

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(html);
  }

  if (fragment.mimeType.startsWith('image/') && imageFormats[extension]) {
    try {
      const convertedImage = await sharp(data, { animated: true })
        .toFormat(imageFormats[extension])
        .toBuffer();

      res.setHeader('Content-Type', requestedType);
      return res.status(200).send(convertedImage);
    } catch (err) {
      logger.error(
        {
          err,
          sourceType: fragment.mimeType,
          requestedType,
        },
        'Image conversion failed'
      );

      return res
        .status(500)
        .json(createErrorResponse(500, 'image conversion failed'));
    }
  }

  return res.status(415).json(createErrorResponse(415, 'unsupported media type'));
};