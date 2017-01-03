/**
 * Attempt to serve static requests from the public folder.
 */
// module.exports = {
//   index: {
//     handler: {
//       file: (request) => `static${request.path}`,
//     },
//   },
// };

module.exports.hello = {
  handler(request, reply) {
    return reply({ result: 'Hello hapi!' });
  },
};
