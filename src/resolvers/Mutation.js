const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Mutation = {
  async createFilter(parent, args, ctx, info) {
    // TODO(SW): Only allow authenticated users to create filters

    // We can access ctx.db.mutation here because we configured the Yoga server
    // to have a `context` property in src/createServer.js.
    const filterTerms = args.filterTerms;
    const filter = await ctx.db.mutation.createFilter(
      {
        data: {
          ...args,
          filterTerms: { set: filterTerms },
        }
      },
      info
    );

    return filter;
  },
  async deleteFilter(parent, args, ctx, info) {
    const where = { id: args.id };

    // Find the filter to be deleted
    const filter = await ctx.db.query.filter({ where }, `{ id name }`);
    // TODO(SW): Check if the user has permission to delete the filter 
    return ctx.db.mutation.deleteFilter({ where }, info);
  },
  async signup(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();

    // Create a hash of the password sent in the request
    const passwordHash = bcrypt.hashSync(args.password, 10);

    // Create the user in the db
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password: passwordHash,
          // TODO(SW): Confirm why this is required 
          permissions: { set: ['USER'] },
        },
      },
      info
    );

    // Create a JWT for the user
    const token = jwt.sign({ iserId: user.id }, process.env.APP_SECRET);

    // Set the JWT token in a cookie
    ctx.response.cookie('token', token, {
      // makes cookie inaccessible to js
      httpOnly: true,
      // TODO(SW): Cnfirm optimal maxAge
      maxAge: 1000 * 60 * 60 * 24, 
    });

    // Return the user to the browser
    return user;
  }
};

module.exports = Mutation;
