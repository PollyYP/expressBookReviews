const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return users.some(user => user.username === username); 
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
const user = users.find(user => user.username === username);
return user && user.password === password;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  // Check if both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Validate the user credentials
  if (authenticatedUser(username, password)) {
    // Create a JWT token
    const accessToken = jwt.sign({ username }, "access", { expiresIn: "1h" });

    // Save the JWT token in the session
    req.session.authorization = { accessToken };

    return res.status(200).json({ message: "User logged in successfully."});
  } else {
    return res.status(401).json({ message: "Invalid username or password." });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
