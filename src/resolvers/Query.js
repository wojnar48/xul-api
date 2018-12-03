const { forwardTo } = require('prisma-binding');

const Query = {
  filters: forwardTo('db'),
};

module.exports = Query;
