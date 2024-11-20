# NotesManagement
# How To Use Code 

 You'll need to run `npm install` in the individual snapshot folders, followed by `npm run dev` to start the development server.

my-project/
├── client/          # React app
├── server/          # Express backend
└── package.json     # Root package.json

########################                       ########################
########################                       ########################

cd server
npm init -y
npm install express cors body-parser pg
# add [    "type": "module",    ] to package.json



########################      in index.js      ########################
########################                       ########################

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import db from "./db.js";
import path from "path";
import url from "url";
// import { fileURLToPath } from 'url';
// import { dirname, join } from 'path';

const app = express();
const port = process.env.PORT || 4000;

// Get the directory name
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.static(join(__dirname, '../frontend/build')));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// API routes

// Serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(port, () => console.log(`Server running on port ${port}`));


########################            ########################
########################            ########################


cd client
npx create-react-app .
npm install axios
npm run build


# If you are using create-react-app, you can simplify development 
# by configuring it to proxy API requests to your Express server. 
# Add this configuration to your client/package.json:
"proxy": "http://localhost:5000"


########################                       ########################
########################                       ########################


cd client
npm install @mui/material 
npm install @mui/icons-material

"@emotion/react": "^11.11.4",
"@emotion/styled": "^11.11.0",
"@mui/icons-material": "^6.0.2",
"@mui/material": "^6.0.2",
########################                       ########################
########################                       ########################



Ensure that your server directory can serve the static
files from your React build directory. This is handled by the express.
static middleware and the app.get('*', ...) route in your Express server.

cd server
node index.js #to text if it work

########################                       ########################
########################                       ########################

cd ..
npm install concurrently --save-dev

# In your root package.json, add the following scripts:
"scripts": {
  "start": "concurrently \"npm run server\" \"npm run client\"",
  "client": "cd client && npm start",
  "server": "cd server && node index.js"
}

# Run Both Servers
# In the root directory:
npm start
########################            ########################
########################            ########################
########################            ########################
########################            ########################
########################            ########################
