const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Category, SubCategory } = require('../models');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const clientUploadDir = path.join(__dirname, '..', '..', 'client', 'public', 'categories');
    if (!fs.existsSync(clientUploadDir)) {
      fs.mkdirSync(clientUploadDir, { recursive: true });
    }
    cb(null, clientUploadDir);
  },
  filename: (req, file, cb) => {
    let categoryName = req.body.CategoryName.replace(/[^a-zA-Z0-9]/g, '_'); // Replace non-alphanumeric characters with underscores
    cb(null, `${categoryName}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage: storage });

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: {
        model: SubCategory,
        as: 'SubCategories'
      }
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get category by ID
router.get('/:CategoryID', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.CategoryID, {
      include: {
        model: SubCategory,
        as: 'SubCategories'
      }
    });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

// Create a new category
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { CategoryName } = req.body;
    const imageURL = req.file ? `/categories/${req.file.filename}` : null;

    const category = await Category.create({ CategoryName, ImageURL: imageURL });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Update category by ID
router.put('/:CategoryID', upload.single('image'), async (req, res) => {
  try {
    const { CategoryName } = req.body;
    const imageURL = req.file ? `/categories/${req.file.filename}` : null;

    const [updated] = await Category.update(
      { CategoryName, ImageURL: imageURL },
      { where: { CategoryID: req.params.CategoryID } }
    );
    if (updated) {
      const updatedCategory = await Category.findByPk(req.params.CategoryID);
      res.status(200).json(updatedCategory);
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// Delete category by ID
router.delete('/:CategoryID', async (req, res) => {
  try {
    const deleted = await Category.destroy({
      where: { CategoryID: req.params.CategoryID }
    });
    if (deleted) {
      res.status(204).json({ message: 'Category deleted' });
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

module.exports = router;
