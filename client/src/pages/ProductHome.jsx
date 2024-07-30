import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Button, Card, CardMedia, CardContent, CardActions, InputBase, IconButton, Grid } from '@mui/material';
import { Search, Clear, ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import http from '../http'; // Assuming http is an axios instance

const ProductHome = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);
  const categoryContainerRef = useRef(null);

  const getCategories = () => {
    http.get('/categories')
      .then((res) => {
        setCategories(res.data);
        setFilteredCategories(res.data);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  };

  const getBestsellerProducts = () => {
    http.get('/products?type=bestseller')
      .then((res) => {
        setProducts(res.data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  };

  useEffect(() => {
    getCategories();
    getBestsellerProducts();
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    const filtered = categories.filter(category =>
      category.CategoryName.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredCategories(filtered);
  };

  const handleClearSearch = () => {
    setSearch('');
    setFilteredCategories(categories);
  };

  const scrollCategories = (direction) => {
    if (categoryContainerRef.current) {
      const scrollAmount = direction === 'left' ? -categoryContainerRef.current.clientWidth : categoryContainerRef.current.clientWidth;
      categoryContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h2">Products</Typography>
        <Typography variant="h6">We offer a wide range of sports products</Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }}>Shop Now</Button>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>Categories</Typography>
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <InputBase
            value={search}
            placeholder="Search categories"
            onChange={handleSearchChange}
            sx={{ flexGrow: 1, px: 2, py: 1, border: '1px solid #ccc', borderRadius: '4px', color: 'black', bgcolor: 'white' }}
          />
          <IconButton color="default" onClick={handleClearSearch} sx={{ p: '10px' }}>
            <Clear />
          </IconButton>
        </Box>
        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => scrollCategories('left')} sx={{ position: 'absolute', left: -50, zIndex: 1 }}>
            <ArrowBackIos />
          </IconButton>
          <Box
            ref={categoryContainerRef}
            sx={{
              display: 'flex',
              overflowX: 'hidden',
              gap: 2,
              width: '100%',
              maxWidth: '100%',
              scrollSnapType: 'x mandatory',
              '& > *': {
                scrollSnapAlign: 'center',
                flex: '0 0 calc(25% - 16px)', // Adjust the width to fit four items with gap
              },
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            {filteredCategories.map((category) => (
              <Card key={category.CategoryID} sx={{ position: 'relative', width: 'calc(25% - 16px)', height: '250px', overflow: 'hidden' }}>
                <CardMedia
                  component="img"
                  sx={{ height: '100%', width: '100%', objectFit: 'cover' }} // Crop the image to fit
                  image={category.ImageURL}
                  alt={category.CategoryName}
                />
                <Box sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  color: 'white',
                  padding: '10px',
                  textAlign: 'center',
                }}>
                  <Typography variant="h6">{category.CategoryName}</Typography>
                </Box>
              </Card>
            ))}
          </Box>
          <IconButton onClick={() => scrollCategories('right')} sx={{ position: 'absolute', right: -50, zIndex: 1 }}>
            <ArrowForwardIos />
          </IconButton>
        </Box>
      </Box>

      <Box>
        <Typography variant="h4" sx={{ mb: 2 }}>Bestsellers</Typography>
        <Grid container spacing={2}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product.ProductID}>
              <Card sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                <Box sx={{ position: 'relative', paddingBottom: '100%', overflow: 'hidden' }}>
                  <CardMedia
                    component="img"
                    sx={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '100%', objectFit: 'cover' }} // Ensure image fits in square container
                    image={product.Colors && product.Colors.length > 0 ? product.Colors[0].ImageURL : 'path/to/default.jpg'} // Display the first color image
                    alt={product.ProductName}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ color: 'black', mb: 1 }}>{product.ProductName}</Typography>
                  <Typography variant="body1" sx={{ color: 'black' }}>${product.BasePrice}</Typography>
                </CardContent>
                <CardActions>
                  <Button variant="contained" color="primary" component={Link} to={`/product/${product.ProductID}`} sx={{ width: '100%' }}>
                    View Product
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button variant="contained" color="primary">See More</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductHome;


