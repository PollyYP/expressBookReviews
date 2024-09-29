const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Successfully registered. Now you can login"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(300).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  // Get the ISBN from the request parameters
  const isbn = req.params.isbn;
  
  // Check if the book exists using the ISBN as the key in the books object
  const book = books[isbn];

  // If the book is found, return it
  if (book) {
    return res.status(200).json(book);
  } else {
    // If not found, return a 404 error
    return res.status(404).json({ message: "Book not found" });
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  // Get the author from the request parameters
  const author = req.params.author;

  // Filter books by matching the author
  const booksByAuthor = Object.values(books).filter(book => book.author === author);

  // If books are found, return them
  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    // If no books are found, return a 404 error
    return res.status(404).json({ message: "No books found for this author" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  // Get the title from the request parameters
  const title = req.params.title;

  // Filter books by matching the title
  const booksByTitle = Object.values(books).filter(book => book.title === title);

  // If books are found, return them
  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  } else {
    // If no books are found, return a 404 error
    return res.status(404).json({ message: "No books found for this title" });
  }
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
