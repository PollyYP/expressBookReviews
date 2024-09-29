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
    req.session.authorization = { accessToken, username };

    return res.status(200).json({ message: "User logged in successfully."});
  } else {
    return res.status(401).json({ message: "Invalid username or password." });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { isbn } = req.params;
  const { review } = req.query; // Get the review from the query string
  const username = req.session.authorization ? req.session.authorization['username'] : null;

  // Validate inputs
  if (!username) {
    return res.status(403).json({ message: "User not authenticated." });
  }
  
  if (!review) {
    return res.status(400).json({ message: "Review text is required." });
  }

  // Check if the book exists in the books database
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  // Initialize reviews if not already present
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  // If the user has already reviewed the book, modify the existing review
  if (books[isbn].reviews[username]) {
    books[isbn].reviews[username] = review; // Modify existing review
    return res.status(200).json({ message: `The review for the book with ISBN ${isbn} has been updated` });
  } else {
    // If it's a new review, add it
    books[isbn].reviews[username] = review;
    return res.status(201).json({ message: `The review for the book with ISBN ${isbn} has been added` });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const username = req.session.authorization ? req.session.authorization['username'] : null;

  // Validate inputs
  if (!username) {
      return res.status(403).json({ message: "User not authenticated." });
  }

  // Check if the book exists in the books database
  if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found." });
  }

  // Check if the user has reviewed the book
  if (!books[isbn].reviews || !books[isbn].reviews[username]) {
      return res.status(404).json({ message: "No review found for this book by the user." });
  }

  // Delete the user's review
  delete books[isbn].reviews[username];
  
  return res.status(200).json({ message: `The review for the book with ISBN ${isbn} posted by the user: ${username} has been deleted.` });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
