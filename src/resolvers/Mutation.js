const Mutation = {
  async createFilter(parent, args, ctx, info) {
    // TODO(SW): Only allow authenticated users to create filters

    // We can access ctx.db.mutation here because we configured the Yoga server
    // to have a `context` property in src/createServer.js.
    const filter = await ctx.db.mutation.createFilter(
      {
        data: {
          ...args,
        }
      },
      info
    );

    return filter;
  }
};

module.exports = Mutation;
