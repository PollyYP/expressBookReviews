const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  // Check for username and password
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Check if username already exists
  if (isValid(username)) {
    return res.status(400).json({ message: "Username already exists." });
  }

  // Add the new user to the users array
  users.push({ username, password });
  console.log(users);
  return res.status(300).json({message: "Successfully registered. Now you can login"});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  // Return a new Promise
  new Promise((resolve, reject) => {
      // Simulate asynchronous operation (like fetching data)
      resolve(books); // Resolve with the list of books
  })
  .then((bookList) => {
      // Send the book list as a response
      return res.status(200).json(bookList);
  })
  .catch((error) => {
      // Handle any potential errors
      return res.status(500).json({ message: "Internal server error", error });
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  // Get the ISBN from the request parameters
  const isbn = req.params.isbn;

  // Create a new Promise
  new Promise((resolve, reject) => {
      // Check if the book exists using the ISBN as the key in the books object
      const book = books[isbn];

      if (book) {
          resolve(book); // Resolve with the book details if found
      } else {
          reject({ message: "Book not found" }); // Reject with an error message if not found
      }
  })
  .then((bookDetails) => {
      // Send the book details as a response
      return res.status(200).json(bookDetails);
  })
  .catch((error) => {
      // Handle the error by sending a 404 status code
      return res.status(404).json(error);
  });
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  // Get the author from the request parameters
  const author = req.params.author;

  // Create a new Promise
  new Promise((resolve, reject) => {
      // Filter books by matching the author
      const booksByAuthor = Object.values(books).filter(book => book.author === author);

      if (booksByAuthor.length > 0) {
          resolve(booksByAuthor); // Resolve with the found books
      } else {
          reject({ message: "No books found for this author" }); // Reject if no books are found
      }
  })
  .then((foundBooks) => {
      // Send the list of books by the author as a response
      return res.status(200).json(foundBooks);
  })
  .catch((error) => {
      // Handle the error by sending a 404 status code
      return res.status(404).json(error);
  });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  // Get the title from the request parameters
  const title = req.params.title;

  // Create a new Promise
  new Promise((resolve, reject) => {
      // Filter books by matching the title
      const booksByTitle = Object.values(books).filter(book => book.title === title);

      if (booksByTitle.length > 0) {
          resolve(booksByTitle); // Resolve with the found books
      } else {
          reject({ message: "No books found for this title" }); // Reject if no books are found
      }
  })
  .then((foundBooks) => {
      // Send the list of books by the title as a response
      return res.status(200).json(foundBooks);
  })
  .catch((error) => {
      // Handle the error by sending a 404 status code
      return res.status(404).json(error);
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  // Get the ISBN from the request parameters
  const isbn = req.params.isbn;

  // Check if the book exists by using the ISBN as the key
  const book = books[isbn];

  // If the book is found, return its reviews
  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    // If the book is not found, return a 404 error
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
