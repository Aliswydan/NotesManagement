import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import db from "./db.js";
import path from "path";
import url from "url";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";
import session from "express-session";
import dotenv from "dotenv";


dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const saltRounds = 10;

// Get the directory name
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000", // URL of your React frontend
  credentials: true, // Allow credentials (cookies, session)
}));


// Serve static files from React client build
app.use(express.static(path.join(__dirname, "../client/build")));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware for authenticated routes
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

// API routes for notes
app.get("/list", isAuthenticated, async (req, res) => {
  try {
    const id = req.user.user_id;
    const result = await db.query("SELECT * FROM TODO WHERE user_id = $1 ORDER BY todo_id DESC", [id]);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.post("/add", isAuthenticated, async (req, res) => {
  try {
    const id = req.user.user_id;
    const { title, description } = req.body;
    const result = await db.query(
      "INSERT INTO TODO (title, description, user_id) VALUES ($1, $2, $3) RETURNING *",
      [title, description, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error adding note:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.put("/edit/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const result = await db.query(
      "UPDATE TODO SET title = $1, description = $2 WHERE todo_id = $3 AND user_id = $4 RETURNING *",
      [title, description, id, req.user.user_id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Note not found" });
    }
  } catch (err) {
    console.error("Error editing note:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/delete/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query("DELETE FROM TODO WHERE todo_id = $1 AND user_id = $2", [id, req.user.user_id]);
    if (result.rowCount > 0) {
      res.json({ message: `Todo with id ${id} was deleted` });
    } else {
      res.status(404).json({ message: "Note not found or access denied" });
    }
  } catch (err) {
    console.error("Error deleting note:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Authentication routes
app.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.json({ message: "Logout successful" });
  });
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    if (!user) {
      return res.status(400).json({ message: info.message });
    }
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: "Login Failed" });
      }
      res.json({ message: "Login successful", user });
    });
  })(req, res, next);
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [username]);

    if (checkResult.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const result = await db.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
      [username, hashedPassword]
    );

    const user = result.rows[0];
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: "Login after registration failed" });
      }
      res.status(200).json({ message: "Registration successful", user });
    });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Google OAuth routes
app.get(
  "/auth/google",
  passport.authenticate("google", { 
    scope: ["profile", "email"] 
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
     failureRedirect: "http://localhost:3000/" 
    }),
  (req, res) => {
    console.log(req.session); // Check if session is created
    console.log(req.user);    // Check if user is authenticated
    res.redirect("http://localhost:3000/NotePage"); // Redirect back to your React app
  }
);

app.get("/auth/check", (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({ isAuthenticated: true });
  } else {
    return res.json({ isAuthenticated: false });
  }
});



// Serve the React app
app.get("*", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// Passport setup
passport.use(
  "local",
  new LocalStrategy(async (username, password, done) => {
    try {
      const result = await db.query("SELECT * FROM users WHERE email = $1", [username]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const valid = await bcrypt.compare(password, user.password);
        if (valid) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect password" });
        }
      } else {
        return done(null, false, { message: "User not found" });
      }
    } catch (err) {
      console.error("Error during local authentication:", err);
      return done(err);
    }
  })
);

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",  
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const result = await db.query("SELECT * FROM users WHERE email = $1", [profile.email]);
        if (result.rows.length === 0) {
          const newUser = await db.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
            [profile.email, "google"]
          );
          return done(null, newUser.rows[0]);
        } else {
          return done(null, result.rows[0]);
        }
      } catch (err) {
        console.error("Error during Google authentication:", err);
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

// Start the server
app.listen(port, () => console.log(`App running on http://localhost:${port}`));
