const { Product, SubCategory, ProductSubCategory, Color } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");
const express = require('express');
const router = express.Router();

// Add a new product with colors
router.post("/", async (req, res) => {
  let data = req.body;

  // Define validation schema
  let validationSchema = yup.object({
    ProductName: yup.string().trim().max(255).required(),
    Description: yup.string().trim().required(),
    BasePrice: yup.number().positive().required(),
    Type: yup.mixed().oneOf(['bestseller', 'newest', 'normal']).required(),
    SubCategories: yup.array().min(1, 'At least one subcategory is required').of(
      yup.object({
        SubCategoryID: yup.number().required(),
        CategoryID: yup.number().required()
      })
    ).required('At least one subcategory is required')
  });

  try {
    // Validate request body
    data = await validationSchema.validate(data, { abortEarly: false });

    // Extract SubCategories from the data
    const { SubCategories, Colors, ...productData } = data;

    // Create the product
    const product = await Product.create(productData);

    // Add associations to subcategories
    for (const subCategory of SubCategories) {
      await ProductSubCategory.create({
        ProductID: product.ProductID,
        SubCategoryID: subCategory.SubCategoryID,
        CategoryID: subCategory.CategoryID
      });
    }

    res.json(product);
  } catch (err) {
    res.status(400).json({ errors: err.errors });
  }
});

// Define a GET route for fetching products
router.get("/", async (req, res) => {
  let condition = {}; // Initialize an empty condition object for the query
  let search = req.query.search; // Get the search query parameter from the request

  // If there is a search query, build the condition object to include an OR clause
  if (search) {
    condition[Op.or] = [
      { ProductName: { [Op.like]: `%${search}%` } }, // Search for products where ProductName matches the search term
      { Description: { [Op.like]: `%${search}%` } }  // Search for products where Description matches the search term
    ];
  }


  try {
    // Fetch all products from the database that match the condition
    // The 'order' option specifies the sorting order
    // [['createdAt', 'DESC']] means ordering by the 'createdAt' column in descending order
    let list = await Product.findAll({
      where: condition, // Apply the search condition
      order: [['createdAt', 'DESC']], // Sort results by the 'createdAt' column in descending order
      include: ['Colors'] // Include associated colors
    });

    // Send the fetched list of products as a JSON response
    res.json(list);
  } catch (error) {
    // Log any error that occurs and send a 500 Internal Server Error response
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Get product by ProductID, check if product exists
router.get("/:id", async (req, res) => {
  let id = req.params.id;
  try {
    let product = await Product.findByPk(id, {
      include: [
        {
          model: SubCategory,
          as: 'SubCategories',
          through: { attributes: [] } // Exclude the join table attributes
        },
        {
          model: Color,
          as: 'Colors'
        }
      ]
    });
    if (!product) {
      res.sendStatus(404);
      return;
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update product by ProductID
router.put("/:id", async (req, res) => {
  let id = req.params.id;

  // Check if product not found
  let product = await Product.findByPk(id);
  if (!product) {
    res.sendStatus(404);
    return;
  }

  let data = req.body;

  // Define validation schema
  let validationSchema = yup.object({
    ProductName: yup.string().trim().max(255),
    Description: yup.string().trim(),
    BasePrice: yup.number().positive(),
    Type: yup.mixed().oneOf(['bestseller', 'newest', 'normal']),
    SubCategories: yup.array().of(
      yup.object({
        SubCategoryID: yup.number().required(),
        CategoryID: yup.number().required()
      })
    )
  });

  try {
    // Validate request body
    data = await validationSchema.validate(data, { abortEarly: false });

    // Extract SubCategories from the data
    const { SubCategories, ...productData } = data;

    // Update the product
    await Product.update(productData, {
      where: { ProductID: id }
    });

    // Update associations to subcategories
    if (SubCategories && SubCategories.length > 0) {
      // Remove existing associations
      await ProductSubCategory.destroy({ where: { ProductID: id } });

      // Add new associations
      for (const subCategory of SubCategories) {
        await ProductSubCategory.create({
          ProductID: id,
          SubCategoryID: subCategory.SubCategoryID,
          CategoryID: subCategory.CategoryID
        });
      }
    }

    res.json({
      message: "Product was updated successfully."
    });
  } catch (err) {
    res.status(400).json({ errors: err.errors });
  }
});

// Delete product by ProductID
router.delete("/:id", async (req, res) => {
  let id = req.params.id;

  try {
    // Find the product to ensure it exists
    let product = await Product.findByPk(id);
    if (!product) {
      res.status(404).json({ message: `Cannot delete product with id ${id}. Product not found.` });
      return;
    }

    // Delete associated colors first
    await Color.destroy({
      where: { ProductID: id }
    });

    // Delete the product
    await Product.destroy({
      where: { ProductID: id }
    });

    res.json({
      message: "Product and its associated colors were deleted successfully."
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
