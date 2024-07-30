import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, InputBase, IconButton } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../http';

function Products() {
    const [productList, setProductList] = useState([]);
    const [search, setSearch] = useState('');
    const [deleteProductId, setDeleteProductId] = useState(null);
    const [open, setOpen] = useState(false);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getProducts = () => {
        http.get('/products').then((res) => {
            setProductList(res.data);
        }).catch(error => {
            console.error('Error fetching products:', error);
        });
    };

    const searchProducts = () => {
        http.get(`/products?search=${search}`).then((res) => {
            setProductList(res.data);
        }).catch(error => {
            console.error('Error searching products:', error);
        });
    };

    useEffect(() => {
        getProducts();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchProducts();
        }
    };

    const onClickSearch = () => {
        searchProducts();
    };

    const onClickClear = () => {
        setSearch('');
        getProducts();
    };

    const handleOpen = (id) => {
        setDeleteProductId(id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteProduct = () => {
        http.delete(`/products/${deleteProductId}`)
            .then((res) => {
                console.log(res.data);
                setOpen(false);
                getProducts();
            }).catch(error => {
                console.error('Error deleting product:', error);
            });
    };

    return (
        <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <InputBase
                    value={search}
                    placeholder="Search products"
                    onChange={onSearchChange}
                    onKeyDown={onSearchKeyDown}
                    sx={{ flexGrow: 1, px: 2, py: 1, border: '1px solid #ccc', borderRadius: '4px', color: 'black', bgcolor: 'white' }}
                />
                <IconButton color="primary" onClick={onClickSearch} sx={{ p: '10px' }}>
                    <Search />
                </IconButton>
                <IconButton color="default" onClick={onClickClear} sx={{ p: '10px' }}>
                    <Clear />
                </IconButton>
                <Button
                    component={Link}
                    to="/addproduct"
                    variant="contained"
                    color="primary"
                    sx={{ height: "100%" }}
                >
                    Add
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'primary.main', '& th': { color: 'common.white', px: 2 } }}>
                            <TableCell width="10%">ID</TableCell>
                            <TableCell width="20%">Product Name</TableCell>
                            <TableCell width="40%">Description</TableCell>
                            <TableCell width="15%" align="center">Price ($)</TableCell>
                            <TableCell width="15%" align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {productList.map((product) => (
                            <TableRow
                                key={product.ProductID}
                                sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' }, '&:hover': { backgroundColor: 'action.selected' }, '& td': { px: 2, color: 'black' } }}
                            >
                                <TableCell>{product.ProductID}</TableCell>
                                <TableCell>{product.ProductName}</TableCell>
                                <TableCell>{product.Description}</TableCell>
                                <TableCell align="center">{product.BasePrice}</TableCell>
                                <TableCell align="center">
                                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                        <Link to={`/editproduct/${product.ProductID}`}>
                                            <Button variant="contained" color="primary">Update</Button>
                                        </Link>
                                        <Button variant="contained" color="secondary" onClick={() => handleOpen(product.ProductID)}>Delete</Button>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Delete Product
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this product?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error" onClick={deleteProduct}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Products;
