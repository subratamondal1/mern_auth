<h1 align="center">MERN AUTH</h1>
<p align="center">MERN STACK AUTHENTICATION FROM SCRATCH (NO 3RD PARTY LIBRARIES FOR AUTHENTICATION)</p>

<h2 align="left">Backend Setup</h2>

Create a new directory called `mern-auth` and then run `npm init -y` to initialize a new project with default settings. Then open it up with VS Code or other Code Editors.

```bash
mkdir mern-auth
cd mern-auth
npm init -y
```

All of our server dependencies will get installed in this directory. Let's install Express, Mongoose, bcryptjs, jsonwebtoken and cookie-parser.

```bash
npm i express dotenv mongoose bcryptjs jsonwebtoken cookie-parser
```

* **Express** - Web framework for Node.js
* **dotenv** - Loads environment variables from a `.env` file
* **mongoose** - MongoDB object modeling tool
* **bcryptjs** - Library for hashing and salting user passwords
* **jsonwebtoken** - Library for generating JWTs
* **cookie-parser** - Middleware for parsing cookies


We will have a directory called **backend** that will contain our server side code. The entry point will be `backend/server.js`.

Let's setup a very basic Express server in `backend/server.js` and get it running.

```js
import express from "express";

const port = 5000;

const app = express();

app.get("/", (req, res) => res.send("API running"));

app.listen(port, () =>
  console.log(`Server started on port http://localhost:${port}`)
);
```

We could run our server with node `backend/server.js` but we want to use nodemon so that we don't have to restart the server every time we make a change. Let's install that as a dev dependency.

```bash
npm i -D nodemon
```

Now, let's add some NPM Scripts to our package.json file.

```json
 "scripts": {
    "start": "node backend/server.js",
    "server": "nodemon backend/server.js"
  },
```

Now we can run `npm run server` to start the server. We should see the message "API running" in the browser at `http://localhost:5000`. '`npm start`` will be used in production.

<h2 align="left">Environment Variables</h2>

Create a file to store enviroment variables, which are basically variables that we don't want to be hard coded into our code. Things like database credentials, API keys, etc. We will be using the `dotenv` package to do this.

Let's create a file named `.env` in the root of our project and add the following:

```bash
NODE_ENV=development
PORT=5000
```

You should also add this `.env` file to your `.gitignore` file so that it doesn't get pushed to GitHub. Create a file in the root called .gitignore and add the following:

```bash
node_modules
.env
```

Now in the `server.js` file, we can import the dotenv package and use it to load our environment variables.

```javascript
import dotenv from "dotenv";
dotenv.config();
```

Now change the port to use the environment variable.

```javascript
const port = process.env.PORT || 5000;
```

Restart the server and now, it should be using the port from the `.env` file. You can change the number to something else to test it.

<h2 align="left">User Routes and Controller</h2>

Let's get our routes setup. We will have the following routes:

* **`POST /api/users`** - Register a user
* **`POST /api/users/auth`** - Authenticate a user and get token
* **`POST /api/users/logout`** - Logout user and clear cookie
* **`GET /api/users/profile`** - Get user profile
* **`PUT /api/users/profile`** - Update profile

Let's start by creating a `routes directory` in backend and then create a file called `userRoutes.js` in there. This will contain all of our user routes.

We could have all of the route logic in this file, but it's better to separate it out into a controller. Let's create a `controllers directory` in backend and then create a file called `userController.js` in there.

Let's start by creating a single controller function and connect it to a route, just to get things going. In `userController.js` add the following code.

We are just sending back a JSON response with a message of `"Success"`. Now, let's connect this to a route. In `userRoutes.js` add the following code.

```javascript
import express from "express";
import authUser from "../controllers/userController.js";

const router = express.Router();
router.post("/auth", authUser);

export default router;
```

We are importing the `authUser` function from `userController.js` and connecting it to the route `POST /api/users/auth`. Now, let's bring this into `server.js` and connect it to the `/api/users` route.

```javascript
import userRoutes from './routes/userRoutes.js';
app.use('/api/users', userRoutes);
```

<h2 align="left">Test the Route</h2>

Make sure to send a `POST` request and not `GET` request, as we have used `router.post("/auth", authUser);`

```bash
// using 'curl'
curl -X POST http://127.0.0.1:5000/api/users/auth

// output
{"message":"Success"}

// using httpie
http post http://localhost:5000/api/users/auth

// output
HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 21
Content-Type: application/json; charset=utf-8
Date: Tue, 05 Mar 2024 04:03:18 GMT
ETag: W/"15-uFFjCr0SbbbFb/CsC0M2sF++swo"
Keep-Alive: timeout=5
X-Powered-By: Express

{
    "message": "Success"
}
```

<h2 align="left">Using an Async Handler</h2>

We will be using `async/await` for our controller functions. We could use `try/catch` blocks in each function, but that would be repetitive. Instead, we will create a function that will wrap around each controller function and handle any errors. We're going to keep it simple and install a package called `express-async-handler` that will do this for us.

```bash
npm i express-async-handler
```

Now, bring that into `userController.js` so that we can use it with our functions.

```bash
import asyncHandler from 'express-async-handler';
```

Now, wrap the `asyncHandler` to the `authUser` function.

```javascript
// before
const authUser = async (req, res) => {
  res.json({ message: "Success" });
};

export default authUser;

// after
import asyncHandler from "express-async-handler";

const authUser = asyncHandler(async (req, res) => {
  res.json({ message: "Success" });
});

export default authUser;
```

This will allow us to use `async/await` in the function and if there is an error, it will be passed to our custom error handler, which we'll create now.

<h2 align="left">Custom Error Handler</h2>

Create a folder called `middleware` in backend and then create a file called `errorMiddleware.js` in there. This will contain our custom error handler.

```javascript
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // If Mongoose not found error, set to 404 and change message
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found";
  }

  res.status(statusCode).json({
    message: message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export { notFound, errorHandler };
```

We are creating two middleware functions. The first one will be used as a catch-all for any routes that don't exist. The second one will be used as a catch-all for any errors that occur in our routes.

So this will allow us to throw an error from any controller function and have it passed to our custom error handler middleware, which will then respond with the appropriate status code and message.

We are also checking for a specific type of error, which is the Mongoose CastError. This is the error that is thrown when an invalid ID is passed to a Mongoose query. We are checking for this and if it occurs, we are setting the status code to 404 and the message to "Resource not found".

This snippet of code is very useful and I use it in most of my Node projects.

Now we have to bring the functions into `server.js` and use them. Add the following to the top of the file.

```javascript
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
```

Now, add the following to the bottom of the file, after the routes.

```javascript
app.use(notFound);
app.use(errorHandler);
```

<h2 align="left">Add The Rest Of The Routes</h2>

Now that we have our error handler setup, we can add the rest of the controller functions and routes. In `userController.js` add the following code.

```javascript
import asyncHandler from "express-async-handler";

// @desc    Authenticate user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  // res.status(401);
  // throw new Error("Something went wrong.");
  res.status(200).json({ message: "Authenticate User" });
});

// @desc    Register a new user
// @route   POST /api/users/
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  // res.status(401);
  // throw new Error("Something went wrong.");
  res.status(200).json({ message: "Register User" });
});

// @desc    Logout user
// @route   POST /api/users/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
  // res.status(401);
  // throw new Error("Something went wrong.");
  res.status(200).json({ message: "Logout User" });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  // res.status(401);
  // throw new Error("Something went wrong.");
  res.status(200).json({ message: "Get User Profile" });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Update User Profile" });
});

export default {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};
```

All we are doing here is sending back a string for now. We will add the actual functionality later.

<h2 align="left">Add The Routes</h2>

Now open the `userRoutes.js` file and add the following code.

```javascript
import express from "express";
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";

const router = express.Router();
router.post("/", registerUser);
router.post("/auth", authUser);
router.post("/logout", logoutUser);
router.route("/profile").get(getUserProfile).put(updateUserProfile);

export default router;
```

Now all of the routes should work and just respond with the string that we added to the controller functions. Go ahead and test them out in Postman, Curl, Httpie or others. Make sure that you have the correct HTTP method selected for each route.
