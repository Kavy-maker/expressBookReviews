const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// ✅ Add this line here — before any routes
app.use(session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));


app.use("/customer/auth/*", function auth(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: "User not logged in" });
    }

    jwt.verify(token, "access", (err, user) => {
        if (!err) {
            req.user = user;
            next();
        } else {
            return res.status(403).json({ message: "User not authenticated" });
        }
    });
});


const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, "0.0.0.0", () => console.log("Server is running"));
