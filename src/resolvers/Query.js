const Query = {
  async searchItems(parent, args, ctx, info) {
    // TODO(SW): Ensure that a given user can only query search items they have created

    const searchItems = await ctx.db.query.searchItems();
    return searchItems;
  }
};

module.exports = Query;
