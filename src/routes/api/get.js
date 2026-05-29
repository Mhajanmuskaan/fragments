// const { createSuccessResponse } = require('../../response');

// /**
//  * Get a list of fragments for the current user
//  */
// module.exports = (req, res) => {
//   res.status(200).json(
//     createSuccessResponse({
//       fragments: [],
//     })
//   );
// };

// Assignment-1

// const { Fragment } = require('../../model/fragment');
// const { createSuccessResponse } = require('../../response');

// /**
//  * Get a list of fragments for the current user
//  */
// module.exports = async (req, res) => {
//   const fragments = await Fragment.byUser(req.user);

//   res.status(200).json(
//     createSuccessResponse({
//       fragments: fragments.map((fragment) => fragment.id),
//     })
//   );
// };

// version-2

// const { Fragment } = require('../../model/fragment');
// const { createSuccessResponse } = require('../../response');

// module.exports = async (req, res) => {
//   const fragments = await Fragment.byUser(req.user);

//   if (req.query.expand === '1') {
//     return res.status(200).json(
//       createSuccessResponse({
//         fragments,
//       })
//     );
//   }

//   return res.status(200).json(
//     createSuccessResponse({
//       fragments: fragments.map((fragment) => fragment.id),
//     })
//   );
// };

// version3professorcode

const { Fragment } = require('../../model/fragment');
const { createSuccessResponse } = require('../../response');

module.exports = async (req, res) => {
  const expand = req.query.expand === '1';

  const fragments = await Fragment.byUser(req.user, expand);

  res.status(200).json(
    createSuccessResponse({
      fragments,
    })
  );
};