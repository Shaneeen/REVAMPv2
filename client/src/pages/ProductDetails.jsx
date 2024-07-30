// pages/ProductDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button, Grid, Card, CardMedia, Select, MenuItem, FormControl, InputLabel, TextField, Stack } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import http from '../http';

function ProductDetails() {
  const { ProductID } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await http.get(`/products/${ProductID}`);
        setProduct(response.data);
        if (response.data.Colors.length > 0) {
          setSelectedColor(response.data.Colors[0]);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [ProductID]);

  const handleColorChange = (event) => {
    const colorID = event.target.value;
    const color = product.Colors.find(c => c.ColorID === colorID);
    setSelectedColor(color);
  };

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };

  if (!product) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          {selectedColor && (
            <Card>
              <CardMedia
                component="img"
                height="400"
                image={selectedColor.ImageURL}
                alt={selectedColor.ColorName}
              />
            </Card>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>{product.ProductName}</Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>{product.Description}</Typography>
          <Typography variant="h5" sx={{ mt: 2 }}>${product.BasePrice}</Typography>
          
          <Box sx={{ mt: 4 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="color-select-label">Select Color</InputLabel>
              <Select
                labelId="color-select-label"
                value={selectedColor ? selectedColor.ColorID : ''}
                onChange={handleColorChange}
                label="Select Color"
                sx={{
                  '& .MuiSelect-select': {
                    color: 'black',
                  },
                }}
              >
                {product.Colors.map(color => (
                  <MenuItem 
                    key={color.ColorID} 
                    value={color.ColorID}
                    sx={{
                      color: 'black',
                    }}
                  >
                    {color.ColorName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <TextField
                label="Quantity"
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                InputProps={{ inputProps: { min: 1 } }}
                sx={{
                  mb: 2,
                  '& .MuiInputBase-input': {
                    color: 'black',
                  },
                }}
              />
            </FormControl>

            <Stack direction="row" spacing={2}>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<AddShoppingCartIcon />}
                sx={{ flexGrow: 1 }}
              >
                Add to Cart
              </Button>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ProductDetails;
