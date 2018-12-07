const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createJWT = require('../lib/createJWT');


const Mutation = {
  async createFilter(parent, args, ctx, info) {
    if (!ctx.request.userId) throw new Error('You must be logged in to create a filter!');

    // We can access ctx.db.mutation here because we configured the Yoga server
    // to have a `context` property in src/createServer.js.
    const filterTerms = args.filterTerms;
    const filter = await ctx.db.mutation.createFilter(
      {
        data: {
          // Connect the filter to the current user creating the filter
          user: {
            connect: {
              id: ctx.request.userId,
            }
          },
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
   
    // Create and set a JWT in a cookie
    createJWT(ctx, user.id);
    
    // Return the user to the browser
    return user;
  },
  async login(parent, args, ctx, info) {
    // Check if there is a user with provided email
    const user = await ctx.db.query.user({ where: { email }});

    if (!user) throw new Error(`No user found for email: ${email}`);

    // Check if password is valid
    const isMatch = bcrypt.compareSync(args.password, user.password);

    if (!isMatch) throw new Error('Invalid password');

    // Create and set a JWT in a cookie
    createJWT(ctx, user.id);

    // Return the user
    return user;
  },
};

module.exports = Mutation;
