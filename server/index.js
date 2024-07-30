require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Enable CORS
app.use(cors({
    origin: process.env.CLIENT_URL
}));

// Middleware to serve static files
app.use(express.static(path.join(__dirname, '..', 'client', 'public')));

// Simple Route for testing
app.get("/", (req, res) => {
    res.send("I really hope that FSDP works out for me");
});

// Product Routes
const productRoute = require('./routes/product');
app.use("/products", productRoute); // Ensure the route matches the endpoint in your frontend

// Category Routes
const categoryRoute = require('./routes/categories');
app.use("/categories", categoryRoute); // Route for categories

// SubCategory Routes
const subCategoryRoute = require('./routes/subcategories');
app.use("/subcategories", subCategoryRoute); // Route for subcategories

// Color Routes
const colorRoute = require('./routes/color');
app.use("/colors", colorRoute); // Route for colors

// Database connection and server start
const db = require('./models');
db.sequelize.sync({ alter: true })
    .then(() => {
        let port = process.env.APP_PORT || 3001; // Fallback port if environment variable is not set
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });
