const express = require('express');
const router = express.Router();
const { SubCategory, Category } = require('../models');

// Get all subcategories
router.get('/', async (req, res) => {
  try {
    const subcategories = await SubCategory.findAll({
      include: {
        model: Category,
        as: 'Category'
      }
    });
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subcategories' });
  }
});

// Get subcategory by ID
router.get('/:SubCategoryID', async (req, res) => {
  try {
    const subcategory = await SubCategory.findByPk(req.params.SubCategoryID, {
      include: {
        model: Category,
        as: 'Category'
      }
    });
    if (!subcategory) {
      return res.status(404).json({ error: 'Subcategory not found' });
    }
    res.json(subcategory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subcategory' });
  }
});

// Create a new subcategory
router.post('/', async (req, res) => {
  try {
    const subcategory = await SubCategory.create(req.body);
    res.status(201).json(subcategory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create subcategory' });
  }
});

// Update subcategory by ID
router.put('/:SubCategoryID', async (req, res) => {
  try {
    const [updated] = await SubCategory.update(req.body, {
      where: { SubCategoryID: req.params.SubCategoryID }
    });
    if (updated) {
      const updatedSubCategory = await SubCategory.findByPk(req.params.SubCategoryID);
      res.status(200).json(updatedSubCategory);
    } else {
      res.status(404).json({ error: 'Subcategory not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update subcategory' });
  }
});

// Delete subcategory by ID
router.delete('/:SubCategoryID', async (req, res) => {
  try {
    const deleted = await SubCategory.destroy({
      where: { SubCategoryID: req.params.SubCategoryID }
    });
    if (deleted) {
      res.status(204).json({ message: 'Subcategory deleted' });
    } else {
      res.status(404).json({ error: 'Subcategory not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete subcategory' });
  }
});

module.exports = router;
