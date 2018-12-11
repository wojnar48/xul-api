const jwt = require('jsonwebtoken');

// Given a context and userId, generates a JWT and sets it
// on `ctx.response.cookie`
const createJWT = (ctx, userId) => {
  // Create a JWT for the user
  const token = jwt.sign({ userId }, process.env.APP_SECRET);

  // Set the JWT token in a cookie.
  // Note: By using cookies (instead of localStorage) we will
  // be able to SSR components that require auth.
  ctx.response.cookie('token', token, {
    // makes cookie inaccessible to js
    httpOnly: true,
    // TODO(SW): Cnfirm optimal maxAge
    maxAge: process.env.JWT_MAX_AGE, 
  });
}

module.exports = {
  createJWT,
};
