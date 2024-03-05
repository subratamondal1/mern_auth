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


