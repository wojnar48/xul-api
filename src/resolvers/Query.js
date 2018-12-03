const { forwardTo } = require('prisma-binding');

const Query = {
  filters: forwardTo('db'),
  filter: forwardTo('db'),
  filtersConnection: forwardTo('db'),
};

module.exports = Query;
