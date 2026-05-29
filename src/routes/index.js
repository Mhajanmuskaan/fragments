const express = require('express');

// version and author from package.json
const { version, author } = require('../../package.json');

// Import authenticate middleware
const authenticate = require('../auth/auth-middleware');

const { createSuccessResponse } = require('../response');

// Create a router that we can use to mount our API
const router = express.Router();

router.use('/v1', authenticate(process.env.AWS_COGNITO_POOL_ID ? 'bearer' : 'http'), require('./api'));

router.get('/', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');

  res.status(200).json(
    createSuccessResponse({
      description: 'fragments service running normally',
      author,
      githubUrl: 'https://github.com/Mhajanmuskaan/fragments',
      version,
      timestamp: new Date().toISOString(),
    })
  );
});

module.exports = router;