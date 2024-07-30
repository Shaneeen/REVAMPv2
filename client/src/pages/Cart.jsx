import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Card, CardMedia, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import http from '../http';

function Cart() {
  const [cartItems, setCartItems] = useState([]);

  const fetchCartItems = async () => {
    try {
      const response = await http.get('/cart');
      console.log('Fetched cart items from server:', response.data); // Log fetched cart items
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const handleRemoveFromCart = async (cartItemID) => {
    try {
      await http.delete(`/cart/remove/${cartItemID}`);
      setCartItems(cartItems.filter(item => item.CartItemID !== cartItemID));
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  if (cartItems.length === 0) {
    return <Typography>Your cart is empty</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>Shopping Cart</Typography>
      <Grid container spacing={4}>
        {cartItems.map(item => (
          <Grid item xs={12} md={6} key={item.CartItemID}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={item.Color.ImageURL}
                alt={item.Color.ColorName}
              />
              <Box sx={{ p: 2 }}>
                <Typography variant="h6">{item.Product.ProductName}</Typography>
                <Typography variant="body1" color="textSecondary">{item.Color.ColorName}</Typography>
                <Typography variant="body1">Quantity: {item.Quantity}</Typography>
                <IconButton 
                  color="secondary" 
                  onClick={() => handleRemoveFromCart(item.CartItemID)}
                  sx={{ mt: 2 }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 4 }}>
        <Button variant="contained" color="primary">Proceed to Checkout</Button>
      </Box>
    </Box>
  );
}

export default Cart;


