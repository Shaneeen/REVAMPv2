import React from 'react';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import AddCategory from './pages/AddCategory';
import Categories from './pages/Categories';
import EditCategory from './pages/EditCategory';
import EditSubCategory from './pages/EditSubCategory';
import ProductHome from './pages/ProductHome';
import ProductDetails from './pages/ProductDetails';

import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <ThemeProvider theme={MyTheme}>
        <AppBar position="static" sx={{ backgroundColor: 'black' }}>
          <Container>
            <Toolbar disableGutters>
              <Typography
                variant="h6"
                component={Link}
                to="/"
                sx={{ flexGrow: 1, color: 'white', textDecoration: 'none' }}
              >
                REVAMP
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button component={Link} to="/products" sx={{ color: 'white' }}>
                  Products
                </Button>
                <Button component={Link} to="/addproduct" sx={{ color: 'white' }}>
                  Add Product
                </Button>
                <Button component={Link} to="/addcategory" sx={{ color: 'white' }}>
                  Add Category
                </Button>
                <Button component={Link} to="/categories" sx={{ color: 'white' }}>
                  Categories
                </Button>
                <Button component={Link} to="/producthome" sx={{ color: 'white' }}>
                  ProductHome
                </Button>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
        <Container>
          <Routes>
            <Route path="/" />
            <Route path="/products" element={<Products />} />
            <Route path="/addproduct" element={<AddProduct />} />
            <Route path="/editproduct/:ProductID" element={<EditProduct />} />
            <Route path="/addcategory" element={<AddCategory />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/editcategory/:CategoryID" element={<EditCategory />} />
            <Route path="/editsubcategory/:SubCategoryID" element={<EditSubCategory />} />
            <Route path="/producthome" element={<ProductHome />} />
            <Route path="/product/:ProductID" element={<ProductDetails />} />
          </Routes>
        </Container>
      </ThemeProvider>
    </Router>
  );
}

export default App;
