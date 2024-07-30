import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, MenuItem, FormControl, Autocomplete, Chip } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';

function EditProduct() {
    const { ProductID } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        ProductName: '',
        Description: '',
        BasePrice: '',
        Color: [],
        Type: '',
        SubCategories: []
    });
    const [subCategories, setSubCategories] = useState([]);
    const [colors, setColors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        http.get(`/products/${ProductID}`).then((res) => {
            const productData = res.data;
            productData.SubCategories = productData.SubCategories ? productData.SubCategories.map(sc => ({ SubCategoryID: sc.SubCategoryID, SubCategoryName: sc.SubCategoryName })) : []; // Set SubCategories to objects
            setProduct(productData);
            setLoading(false);
        }).catch(error => {
            console.error('Error fetching product data:', error);
        });

        http.get('/subcategories')
            .then(response => {
                setSubCategories(response.data);
            })
            .catch(error => {
                console.error('Failed to fetch subcategories:', error);
            });

        http.get(`/colors/${ProductID}`)
            .then(response => {
                setColors(response.data);
            })
            .catch(error => {
                console.error('Failed to fetch colors:', error);
            });
    }, [ProductID]);

    const formik = useFormik({
        initialValues: product,
        enableReinitialize: true,
        validationSchema: yup.object({
            ProductName: yup.string().required('Product name is required'),
            Description: yup.string().required('Description is required'),
            BasePrice: yup.number().required('Base price is required').positive('Base price must be a positive number'),
            Type: yup.string().required('Type is required').oneOf(['bestseller', 'newest', 'normal'], 'Invalid type specified'),
            SubCategories: yup.array().of(yup.object({
                SubCategoryID: yup.number().required(),
                SubCategoryName: yup.string().required()
            })).min(1, 'At least one subcategory is required')
        }),
        onSubmit: async (data) => {
            try {
                const postData = {
                    ...data,
                    BasePrice: parseFloat(data.BasePrice),
                    SubCategories: data.SubCategories.map(subCategory => {
                        const selectedSubCategory = subCategories.find(sub => sub.SubCategoryID === subCategory.SubCategoryID);
                        return {
                            SubCategoryID: selectedSubCategory.SubCategoryID,
                            CategoryID: selectedSubCategory.Category.CategoryID
                        };
                    })
                };

                // Update product data
                await http.put(`/products/${ProductID}`, postData);

                // Update colors
                for (const color of colors) {
                    const formData = new FormData();
                    formData.append('ProductID', ProductID);
                    formData.append('ColorName', color.ColorName);
                    if (color.image) {
                        formData.append('image', color.image);
                    }

                    if (color.ColorID) {
                        // Update existing color
                        formData.append('ColorID', color.ColorID);
                        await http.put(`/colors/${color.ColorID}`, formData);
                    } else {
                        // Add new color
                        await http.post('/colors', formData);
                    }
                }

                navigate("/products");
            } catch (error) {
                console.error('Error:', error);
            }
        }
    });

    const handleAddColor = () => {
        setColors([...colors, { ColorName: '', image: null }]);
    };

    const handleColorNameChange = (index, value) => {
        const newColors = [...colors];
        newColors[index].ColorName = value;
        setColors(newColors);
    };

    const handleColorImageChange = (index, file) => {
        const newColors = [...colors];
        newColors[index].image = file;
        setColors(newColors);
    };

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteProduct = () => {
        http.delete(`/products/${ProductID}`)
            .then((res) => {
                console.log(res.data);
                navigate("/products");
            });
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', my: 4 }}>
            <Typography variant="h5" sx={{ my: 2 }}>
                Edit Product
            </Typography>
            {
                !loading && (
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Product Name"
                            name="ProductName"
                            value={formik.values.ProductName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.ProductName && Boolean(formik.errors.ProductName)}
                            helperText={formik.touched.ProductName && formik.errors.ProductName}
                            InputProps={{ style: { color: 'black', backgroundColor: 'white' } }}
                        />
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            multiline minRows={2}
                            label="Description"
                            name="Description"
                            value={formik.values.Description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.Description && Boolean(formik.errors.Description)}
                            helperText={formik.touched.Description && formik.errors.Description}
                            InputProps={{ style: { color: 'black', backgroundColor: 'white' } }}
                        />
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Base Price"
                            name="BasePrice"
                            type="number"
                            value={formik.values.BasePrice}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.BasePrice && Boolean(formik.errors.BasePrice)}
                            helperText={formik.touched.BasePrice && formik.errors.BasePrice}
                            InputProps={{ style: { color: 'black', backgroundColor: 'white' } }}
                        />
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Type"
                            name="Type"
                            select
                            SelectProps={{ native: true }}
                            value={formik.values.Type}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.Type && Boolean(formik.errors.Type)}
                            helperText={formik.touched.Type && formik.errors.Type}
                            InputProps={{ style: { color: 'black', backgroundColor: 'white' } }}
                        >
                            <option value=""></option>
                            <option value="bestseller">Bestseller</option>
                            <option value="newest">Newest</option>
                            <option value="normal">Normal</option>
                        </TextField>

                        <FormControl fullWidth margin="dense">
                            <Autocomplete
                                multiple
                                id="subcategories"
                                options={subCategories}
                                getOptionLabel={(option) => option.SubCategoryName}
                                isOptionEqualToValue={(option, value) => option.SubCategoryID === value.SubCategoryID}
                                value={formik.values.SubCategories}
                                onChange={(event, value) => formik.setFieldValue('SubCategories', value)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label="SubCategories"
                                        placeholder="Select SubCategories"
                                        error={formik.touched.SubCategories && Boolean(formik.errors.SubCategories)}
                                        helperText={formik.touched.SubCategories && formik.errors.SubCategories}
                                        InputProps={{ ...params.InputProps, style: { color: 'black', backgroundColor: 'white' } }}
                                    />
                                )}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => {
                                        const { key, ...tagProps } = getTagProps({ index });
                                        return (
                                            <Chip
                                                key={option.SubCategoryID}
                                                label={option.SubCategoryName}
                                                {...tagProps}
                                                sx={{ color: 'black', backgroundColor: '#f0f0f0' }}
                                            />
                                        );
                                    })
                                }
                                ListboxProps={{
                                    style: { color: 'black', backgroundColor: 'white' }
                                }}
                            />
                        </FormControl>

                        <Box sx={{ mt: 2 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Edit Colors
                            </Typography>
                            {colors.map((color, index) => (
                                <Box key={index} sx={{ mb: 2 }}>
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        autoComplete="off"
                                        label="Color Name"
                                        value={color.ColorName}
                                        onChange={(e) => handleColorNameChange(index, e.target.value)}
                                        InputProps={{ style: { color: 'black', backgroundColor: 'white' } }}
                                    />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleColorImageChange(index, e.target.files[0])}
                                    />
                                </Box>
                            ))}
                            <Button variant="contained" sx={{ mt: 2 }} onClick={handleAddColor}>
                                Add Color
                            </Button>
                        </Box>

                        <Box sx={{ mt: 2 }}>
                            <Button variant="contained" type="submit">
                                Update
                            </Button>
                            <Button variant="contained" sx={{ ml: 2 }} color="error" onClick={handleOpen}>
                                Delete
                            </Button>
                        </Box>
                    </Box>
                )
            }
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

export default EditProduct;
