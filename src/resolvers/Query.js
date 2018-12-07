const { forwardTo } = require('prisma-binding');

const Query = {
  filters: forwardTo('db'),
  filter: forwardTo('db'),
  filtersConnection: forwardTo('db'),
  me(parent, args, ctx, info) {
    // Check if there is a current user
    if (!ctx.request.userId) return null;

    return ctx.db.query.user(
      {
        where: { id: ctx.request.userId },
      },
      info
    );
  }
};

module.exports = Query;
