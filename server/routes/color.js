const { Color } = require('../models');
const yup = require("yup");
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Setup multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', '..', 'client', 'public', 'products'));
  },
  filename: (req, file, cb) => {
    // Upload with a temporary name
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

// Update color by ColorID
router.put("/:id", upload.single('image'), async (req, res) => {
  let id = req.params.id;

  // Check if color not found
  let color = await Color.findByPk(id);
  if (!color) {
    res.sendStatus(404);
    return;
  }

  let data = req.body;

  // Define validation schema
  let validationSchema = yup.object({
    ColorID: yup.number().required(),
    ProductID: yup.number().required(),
    ColorName: yup.string().trim().max(255).required()
  });

  try {
    // Validate request body
    data = await validationSchema.validate(data, { abortEarly: false });

    const { ColorID, ProductID, ColorName } = data;
    const tempFilename = req.file ? req.file.filename : null;
    const newFilename = tempFilename ? `${ProductID}_${ColorName}${path.extname(req.file.originalname)}` : null;
    const newFilePath = tempFilename ? path.join(req.file.destination, newFilename) : null;

    if (tempFilename) {
      // Rename the file
      fs.renameSync(req.file.path, newFilePath);
    }

    const imageURL = tempFilename ? `/products/${newFilename}` : color.ImageURL;

    // Update the color
    await Color.update({
      ColorName,
      ImageURL: imageURL
    }, {
      where: { ColorID: id }
    });

    res.json({
      message: "Color was updated successfully."
    });
  } catch (err) {
    res.status(400).json({ errors: err.errors });
  }
});

// Add color to a product
router.post("/", upload.single('image'), async (req, res) => {
  let data = req.body;

  // Define validation schema
  let validationSchema = yup.object({
    ProductID: yup.number().required(),
    ColorName: yup.string().trim().max(255).required(),
  });

  try {
    // Validate request body
    data = await validationSchema.validate(data, { abortEarly: false });

    // Extract values from the request
    const { ProductID, ColorName } = data;
    const tempFilename = req.file.filename;
    const newFilename = `${ProductID}_${ColorName}${path.extname(req.file.originalname)}`;
    const newFilePath = path.join(req.file.destination, newFilename);

    // Rename the file
    fs.renameSync(req.file.path, newFilePath);

    const imageURL = `/products/${newFilename}`;
    const colorData = {
      ProductID,
      ColorName,
      ImageURL: imageURL
    };

    // Create the color
    const color = await Color.create(colorData);

    res.json(color);
  } catch (err) {
    res.status(400).json({ errors: err.errors });
  }
});

// Get colors by ProductID
router.get("/:productID", async (req, res) => {
  let productID = req.params.productID;
  try {
    let colors = await Color.findAll({ where: { ProductID: productID } });
    res.json(colors);
  } catch (error) {
    console.error('Error fetching colors:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
