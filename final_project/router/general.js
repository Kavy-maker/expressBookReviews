const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // Check if username already exists
    const userExists = users.some(user => user.username === username);
    if (userExists) {
        return res.status(409).json({ message: "Username already exists. Please choose another." });
    }

    // Register the user
    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully." });
});

// Get books in the list
public_users.get('/books', function (req, res) {
    return res.status(200).json(books);
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    return res.status(200).json(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here

    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        res.status(200).json(book);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const bookList = Object.values(books); // turn object into array

    const booksByAuthor = bookList.filter(book => book.author === author);

    if (booksByAuthor.length > 0) {
        return res.status(200).json(booksByAuthor);
    } else {
        return res.status(404).json({ message: "Author not found" });
    }
});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const titleParam = req.params.title.toLowerCase();
    const booksByTitle = [];

    // Iterate over all books
    Object.keys(books).forEach(isbn => {
        const book = books[isbn];
        if (book.title.toLowerCase() === titleParam) {
            booksByTitle.push(book);
        }
    });

    if (booksByTitle.length === 0) {
        return res.status(404).json({ message: "No books found with the given title" });
    }

    return res.status(200).json(booksByTitle);
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn; // Get the ISBN from the web address

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: `Book with ISBN: ${isbn} not found` });
    }

    // Get the reviews for the book
    const reviews = books[isbn].reviews;

    // Check if reviews exist and are not empty
    if (!reviews || Object.keys(reviews).length === 0) {
        return res.status(404).json({ message: `No reviews found for ISBN: ${isbn}` });
    }

    // If we reach here, reviews exist and are not empty
    return res.status(200).json({ book_reviews: reviews });
});


module.exports.general = public_users;
