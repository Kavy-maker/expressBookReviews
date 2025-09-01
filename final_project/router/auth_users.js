const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
}

const authenticatedUser = (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // Check if user exists and password matches
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate JWT
    const token = jwt.sign({ username }, "access", { expiresIn: '1h' });

    // Save username in session
    req.session.username = username;

    return res.status(200).json({
        message: "Login successful",
        token
    });
});


// Add a book review

regd_users.post("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;

    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // If no token is provided
    if (!token) {
        return res.status(401).json({ message: "Missing token" });
    }

    try {
        // Verify token and extract username
        const decoded = jwt.verify(token, "access");
        const username = decoded.username;

        // Check if book exists
        const book = books[isbn];
        if (!book) {
            return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
        }

        // Check if review is provided
        if (!review) {
            return res.status(400).json({ message: "Review text is required" });
        }

        // Add or update review
        const isUpdate = Boolean(book.reviews[username]);
        book.reviews[username] = review;

        return res.status(200).json({
            message: isUpdate
                ? `Review updated successfully by ${username}.`
                : `Review added successfully by ${username}.`,
            reviews: book.reviews
        });
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
