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

// Task 10: Get list of books using async/await
public_users.get('/async/books', async function (req, res) {
    try {
        // Simulate async operation with a Promise
        const getBooks = () => {
            return new Promise((resolve) => {
                setTimeout(() => resolve(books), 100); // small delay to mimic async
            });
        };

        const allBooks = await getBooks();
        return res.status(200).json(allBooks);
    } catch (error) {
        console.error("Error fetching books:", error.message);
        return res.status(500).json({ message: "Error fetching books" });
    }
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

//Task 11: Get book details by ISBN using async/await (Promise)
public_users.get('/async/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;

        // Simulate async operation with a Promise
        const getBookByISBN = (isbn) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const book = books[isbn];
                    if (book) {
                        resolve(book);
                    } else {
                        reject(new Error("Book not found"));
                    }
                }, 100); // small delay to mimic async
            });
        };

        const book = await getBookByISBN(isbn);
        return res.status(200).json(book);

    } catch (error) {
        return res.status(404).json({ message: error.message });
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

//Task 12: Get book details by Author using async/await (Promise)
public_users.get('/async/author/:author', async function (req, res) {
    try {
        const authorParam = req.params.author;

        //async operation with a Promise
        const getBooksByAuthor = (author) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const bookList = Object.values(books);
                    const booksByAuthor = bookList.filter(book => book.author === author);

                    if (booksByAuthor.length > 0) {
                        resolve(booksByAuthor);
                    } else {
                        reject(new Error("Author not found"));
                    }
                }, 100); // small delay to mimic async
            });
        };

        const matchedBooks = await getBooksByAuthor(authorParam);
        return res.status(200).json(matchedBooks);

    } catch (error) {
        return res.status(404).json({ message: error.message });
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

// Task 13: Get book details by Title using async/await (Promise)
public_users.get('/async/title/:title', async function (req, res) {
    try {
        const titleParam = req.params.title.toLowerCase();

        // Simulate async operation with a Promise
        const getBooksByTitle = (title) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const booksByTitle = [];

                    Object.keys(books).forEach(isbn => {
                        const book = books[isbn];
                        if (book.title.toLowerCase() === title) {
                            booksByTitle.push(book);
                        }
                    });

                    if (booksByTitle.length > 0) {
                        resolve(booksByTitle);
                    } else {
                        reject(new Error("No books found with the given title"));
                    }
                }, 100); // small delay to mimic async
            });
        };

        const matchedBooks = await getBooksByTitle(titleParam);
        return res.status(200).json(matchedBooks);

    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
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
