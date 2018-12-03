const Query = {
  async filters(parent, args, ctx, info) {
    // TODO(SW): Ensure that a given user can only query search items they have created

    const filters = await ctx.db.query.filters();
    return filters;
  }
};

module.exports = Query;
