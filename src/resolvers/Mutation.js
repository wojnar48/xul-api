const Mutation = {
  async createSearchItem(parent, args, ctx, info) {
    // TODO(SW): Only allow authenticated users to create search items

    // We can access ctx.db.mutation here because we configured the Yoga server
    // to have a `context` property in src/createServer.js.
    const searchItem = await ctx.db.mutation.createSearchItem(
      {
        data: {
          ...args,
        }
      },
      info
    );

    return searchItem;
  }
};

module.exports = Mutation;
