require('dotenv').config({ path: '.env' });
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const createServer = require('./createServer');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const { dailyJobFinder } = require('./jobs');


const server = createServer();

// Use the `cookie-parser` middleware to parse cookies
server.express.use(cookieParser());

// Parse body of incoming requests for x-www-form-urlencoded and json
server.express.use(bodyParser.urlencoded({ extended: false }));
server.express.use(bodyParser.json());

// Create a middleware to decode the JWT token that lives in
// cookies so that we have a user ID on each request.
server.express.use((req, res, next) => {
  const { token } = req.cookies;
  
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    req.userId = userId;
  }
  // call the next middleware in the chain
  next();
});

/**

  * * * * * *
  | | | | | |
  | | | | | day of week
  | | | | month
  | | | day of month
  | | hour
  | minute
  second ( optional )

*/

// http://hn.algolia.com/api/v1/search?query=firefox&tags=story&numericFilters=created_at_i>1544480133,created_at_i<1544566533
console.log('Scheduling DAILY filter job finding task');
cron.schedule('* * * * *', dailyJobFinder)

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL,
    }
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  }
);