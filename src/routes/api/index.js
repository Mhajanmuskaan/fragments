

// const express = require('express');
// const contentType = require('content-type');

// const { Fragment } = require('../../model/fragment');

// // Create a router on which to mount our API endpoints
// const router = express.Router();

// // Support sending various Content-Types on the body up to 5M in size
// const rawBody = () =>
//   express.raw({
//     inflate: true,
//     limit: '5mb',
//     type: (req) => {
//       try {
//         const { type } = contentType.parse(req);
//         return Fragment.isSupportedType(type);
//       } catch {
//         return false;
//       }
//     },
//   });

// // Define our routes
// router.get('/fragments', require('./get'));
// router.post('/fragments', rawBody(), require('./post'));
// router.get('/fragments/:id', require('./get-by-id'));

// // Other routes (DELETE, etc.) will go here later on...

// module.exports = router;



const express = require('express');
const contentType = require('content-type');

const { Fragment } = require('../../model/fragment');

const router = express.Router();

const rawBody = () =>
  express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      try {
        const { type } = contentType.parse(req);
        return Fragment.isSupportedType(type);
      } catch {
        return false;
      }
    },
  });

router.get('/fragments', require('./get'));
router.post('/fragments', rawBody(), require('./post'));
router.get('/fragments/:id/info', require('./get-info'));
router.get('/fragments/:id', require('./get-by-id'));

module.exports = router;