const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/youtubeRegistration", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a schema and model for the User collection
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

// Serve the login page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

// Handle the login form submission
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Find a user with matching username and password
  User.findOne({ username, password })
    .then((user) => {
      if (user) {
        // Authentication successful
        res.send("Login successful!");
      } else {
        // Authentication failed
        res.send("Invalid username or password.");
      }
    })
    .catch((err) => {
      console.error(err);
      res.send("An error occurred");
    });
});

// Handle the registration form submission
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      // Username already exists
      res.send("Username already exists.");
    } else {
      // Create a new user
      const newUser = new User({ username, password });

      // Save the user to the database
      await newUser.save();
      res.send("Registration successful!");
    }
  } catch (err) {
    console.error(err);
    res.send("An error occurred");
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
