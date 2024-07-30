const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

// Import routes
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const subcategoryRoutes = require('./routes/subcategories');
const cartRoutes = require('./routes/cart');

// Use routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/cart', cartRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
