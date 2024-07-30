require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser());

// Enable CORS with credentials support
app.use(cors({
    origin: process.env.CLIENT_URL, // Ensure this environment variable is set to your frontend's URL
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));

// Database connection
const db = require('./models');
const sequelize = db.sequelize;

// Session store using Sequelize
const sessionStore = new SequelizeStore({
    db: sequelize,
});

app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true if using https
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

// Middleware to serve static files
app.use(express.static(path.join(__dirname, '..', 'client', 'public')));

// Simple Route for testing
app.get("/", (req, res) => {
    res.send("I really hope that FSDP works out for me");
});

// Product Routes
const productRoute = require('./routes/product');
app.use("/products", productRoute);

// Category Routes
const categoryRoute = require('./routes/categories');
app.use("/categories", categoryRoute);

// SubCategory Routes
const subCategoryRoute = require('./routes/subcategories');
app.use("/subcategories", subCategoryRoute);

// Color Routes
const colorRoute = require('./routes/color');
app.use("/colors", colorRoute);

// Cart Routes
const cartRoute = require('./routes/cart');
app.use("/cart", cartRoute);

// Sync database and session store, then start server
sequelize.sync({ alter: true }).then(() => {
    sessionStore.sync(); // Sync session store
    let port = process.env.APP_PORT || 3001; // Fallback port if environment variable is not set
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
}).catch((err) => {
    console.log(err);
});
