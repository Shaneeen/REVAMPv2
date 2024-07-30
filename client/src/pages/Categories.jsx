import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, InputBase, IconButton, Typography } from '@mui/material';
import { Search, Clear, Edit, Delete } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../http';

function Categories() {
    const [categoryList, setCategoryList] = useState([]);
    const [subCategoryList, setSubCategoryList] = useState([]);
    const [categorySearch, setCategorySearch] = useState('');
    const [subCategorySearch, setSubCategorySearch] = useState('');
    const [deleteCategoryId, setDeleteCategoryId] = useState(null);
    const [deleteSubCategoryId, setDeleteSubCategoryId] = useState(null);
    const [openDeleteCategory, setOpenDeleteCategory] = useState(false);
    const [openDeleteSubCategory, setOpenDeleteSubCategory] = useState(false);

    const onCategorySearchChange = (e) => {
        setCategorySearch(e.target.value);
    };

    const onSubCategorySearchChange = (e) => {
        setSubCategorySearch(e.target.value);
    };

    const getCategories = () => {
        http.get('/categories').then((res) => {
            setCategoryList(res.data);
        }).catch(error => {
            console.error('Error fetching categories:', error);
        });

        http.get('/subcategories').then((res) => {
            setSubCategoryList(res.data);
        }).catch(error => {
            console.error('Error fetching subcategories:', error);
        });
    };

    const searchCategories = () => {
        http.get(`/categories`).then((res) => {
            const filteredCategories = res.data.filter(category => 
                category.CategoryName.toLowerCase().includes(categorySearch.toLowerCase()));
            setCategoryList(filteredCategories);
        }).catch(error => {
            console.error('Error searching categories:', error);
        });
    };

    const searchSubCategories = () => {
        http.get(`/subcategories`).then((res) => {
            const filteredSubCategories = res.data.filter(subcategory => 
                subcategory.SubCategoryName.toLowerCase().includes(subCategorySearch.toLowerCase()));
            setSubCategoryList(filteredSubCategories);
        }).catch(error => {
            console.error('Error searching subcategories:', error);
        });
    };

    useEffect(() => {
        getCategories();
    }, []);

    const onCategorySearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchCategories();
        }
    };

    const onSubCategorySearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchSubCategories();
        }
    };

    const onClickCategorySearch = () => {
        searchCategories();
    };

    const onClickSubCategorySearch = () => {
        searchSubCategories();
    };

    const onClickClearCategorySearch = () => {
        setCategorySearch('');
        http.get('/categories').then((res) => {
            setCategoryList(res.data);
        }).catch(error => {
            console.error('Error fetching categories:', error);
        });
    };

    const onClickClearSubCategorySearch = () => {
        setSubCategorySearch('');
        http.get('/subcategories').then((res) => {
            setSubCategoryList(res.data);
        }).catch(error => {
            console.error('Error fetching subcategories:', error);
        });
    };

    const handleOpenDeleteCategory = (id) => {
        setDeleteCategoryId(id);
        setOpenDeleteCategory(true);
    };

    const handleCloseDeleteCategory = () => {
        setOpenDeleteCategory(false);
    };

    const handleOpenDeleteSubCategory = (id) => {
        setDeleteSubCategoryId(id);
        setOpenDeleteSubCategory(true);
    };

    const handleCloseDeleteSubCategory = () => {
        setOpenDeleteSubCategory(false);
    };

    const deleteCategory = () => {
        http.delete(`/categories/${deleteCategoryId}`)
            .then((res) => {
                console.log(res.data);
                setOpenDeleteCategory(false);
                getCategories();
            }).catch(error => {
                console.error('Error deleting category:', error);
            });
    };

    const deleteSubCategory = () => {
        http.delete(`/subcategories/${deleteSubCategoryId}`)
            .then((res) => {
                console.log(res.data);
                setOpenDeleteSubCategory(false);
                getCategories();
            }).catch(error => {
                console.error('Error deleting subcategory:', error);
            });
    };

    return (
        <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <InputBase
                    value={categorySearch}
                    placeholder="Search categories"
                    onChange={onCategorySearchChange}
                    onKeyDown={onCategorySearchKeyDown}
                    sx={{ flexGrow: 1, px: 2, py: 1, border: '1px solid #ccc', borderRadius: '4px', color: 'black', bgcolor: 'white' }}
                />
                <IconButton color="primary" onClick={onClickCategorySearch} sx={{ p: '10px' }}>
                    <Search />
                </IconButton>
                <IconButton color="default" onClick={onClickClearCategorySearch} sx={{ p: '10px' }}>
                    <Clear />
                </IconButton>
                <Button
                    component={Link}
                    to="/addcategory"
                    variant="contained"
                    color="primary"
                    sx={{ height: "100%" }}
                >
                    Add
                </Button>
            </Box>

            <Typography variant="h6" sx={{ mb: 2 }}>Main Categories</Typography>
            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'primary.main', '& th': { color: 'common.white', px: 2 } }}>
                            <TableCell>ID</TableCell>
                            <TableCell>Category Name</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categoryList.map((category) => (
                            <TableRow
                                key={category.CategoryID}
                                sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' }, '&:hover': { backgroundColor: 'action.selected' }, '& td': { px: 2, color: 'black' } }}
                            >
                                <TableCell>{category.CategoryID}</TableCell>
                                <TableCell>{category.CategoryName}</TableCell>
                                <TableCell align="center">
                                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                        <Link to={`/editcategory/${category.CategoryID}`}>
                                            <Button variant="contained" color="primary" startIcon={<Edit />}>Edit</Button>
                                        </Link>
                                        <Button variant="contained" color="secondary" startIcon={<Delete />} onClick={() => handleOpenDeleteCategory(category.CategoryID)}>Delete</Button>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2, mt: 4 }}>
                <InputBase
                    value={subCategorySearch}
                    placeholder="Search subcategories"
                    onChange={onSubCategorySearchChange}
                    onKeyDown={onSubCategorySearchKeyDown}
                    sx={{ flexGrow: 1, px: 2, py: 1, border: '1px solid #ccc', borderRadius: '4px', color: 'black', bgcolor: 'white' }}
                />
                <IconButton color="primary" onClick={onClickSubCategorySearch} sx={{ p: '10px' }}>
                    <Search />
                </IconButton>
                <IconButton color="default" onClick={onClickClearSubCategorySearch} sx={{ p: '10px' }}>
                    <Clear />
                </IconButton>
            </Box>

            <Typography variant="h6" sx={{ mb: 2 }}>Subcategories</Typography>
            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'primary.main', '& th': { color: 'common.white', px: 2 } }}>
                            <TableCell>ID</TableCell>
                            <TableCell>Subcategory Name</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {subCategoryList.map((sub) => (
                            <TableRow
                                key={sub.SubCategoryID}
                                sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' }, '&:hover': { backgroundColor: 'action.selected' }, '& td': { px: 2, color: 'black' } }}
                            >
                                <TableCell>{sub.SubCategoryID}</TableCell>
                                <TableCell>{sub.SubCategoryName}</TableCell>
                                <TableCell>{sub.Category.CategoryName}</TableCell>
                                <TableCell align="center">
                                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                        <Link to={`/editsubcategory/${sub.SubCategoryID}`}>
                                            <Button variant="contained" color="primary" startIcon={<Edit />}>Edit</Button>
                                        </Link>
                                        <Button variant="contained" color="secondary" startIcon={<Delete />} onClick={() => handleOpenDeleteSubCategory(sub.SubCategoryID)}>Delete</Button>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDeleteCategory} onClose={handleCloseDeleteCategory}>
                <DialogTitle>Delete Category</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to delete this category?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit" onClick={handleCloseDeleteCategory}>Cancel</Button>
                    <Button variant="contained" color="error" onClick={deleteCategory}>Delete</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDeleteSubCategory} onClose={handleCloseDeleteSubCategory}>
                <DialogTitle>Delete Subcategory</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to delete this subcategory?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit" onClick={handleCloseDeleteSubCategory}>Cancel</Button>
                    <Button variant="contained" color="error" onClick={deleteSubCategory}>Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Categories;
