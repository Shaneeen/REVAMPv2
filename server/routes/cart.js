const express = require('express');
const router = express.Router();
const { Cart, CartItem, Product, Color } = require('../models');
const { v4: uuidv4 } = require('uuid');

// Middleware to get or create cart
const getOrCreateCart = async (req, res, next) => {
    let sessionID = req.cookies.sessionID;
    if (!sessionID) {
      sessionID = uuidv4();
      res.cookie('sessionID', sessionID, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 }); // 30 days
    }
  
    let cart = await Cart.findOne({ where: { SessionID: sessionID } });
    if (!cart) {
      cart = await Cart.create({ SessionID: sessionID });
    }
  
    req.cart = cart;
    req.sessionID = sessionID; // Store sessionID in the request object
    next();
  }; 
    
  router.post('/add', getOrCreateCart, async (req, res) => {
    const { ProductID, ColorID, Quantity } = req.body;
    const { CartID } = req.cart;
  
    console.log('Request to add to cart:', { CartID, ProductID, ColorID, Quantity });
  
    try {
      const cartItem = await CartItem.create({
        CartID,
        ProductID,
        ColorID,
        Quantity
      });
  
      console.log('Item added to cart:', cartItem.toJSON());
      res.json({ message: 'Item added to cart successfully' });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      res.status(500).json({ message: 'Error adding item to cart', error });
    }
  });
  
  router.get('/', getOrCreateCart, async (req, res) => {
    try {
      const cartItems = await CartItem.findAll({
        where: { CartID: req.cart.CartID },
        include: [
          {
            model: Product,
            as: 'Product'
          },
          {
            model: Color,
            as: 'Color'
          }
        ]
      });
  
      console.log('Fetched cart items:', cartItems); // Log cart items to verify
      res.json(cartItems);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Remove item from cart
router.delete("/remove/:id", getOrCreateCart, async (req, res) => {
  const { id } = req.params;

  try {
    await CartItem.destroy({ where: { CartItemID: id, CartID: req.cart.CartID } });
    res.json({ message: 'Item removed from cart successfully' });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

