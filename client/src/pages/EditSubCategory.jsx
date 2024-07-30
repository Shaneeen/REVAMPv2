import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, MenuItem, FormControl, Select, InputLabel } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';

function EditSubCategory() {
    const { SubCategoryID } = useParams();
    const navigate = useNavigate();
    const [subCategory, setSubCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        http.get(`/subcategories/${SubCategoryID}`).then((res) => {
            setSubCategory(res.data);
            setLoading(false);
        }).catch(error => {
            console.error('Error fetching subcategory data:', error);
        });

        http.get('/categories').then((res) => {
            setCategories(res.data);
        }).catch(error => {
            console.error('Error fetching categories:', error);
        });
    }, [SubCategoryID]);

    const formik = useFormik({
        initialValues: subCategory || {
            SubCategoryName: '',
            CategoryID: '',
        },
        enableReinitialize: true,
        validationSchema: yup.object({
            SubCategoryName: yup.string().required('Subcategory name is required'),
            CategoryID: yup.string().required('Category is required'),
        }),
        onSubmit: (data) => {
            http.put(`/subcategories/${SubCategoryID}`, data)
                .then(res => {
                    navigate("/categories");
                })
                .catch(error => {
                    console.error('Error updating subcategory:', error);
                });
        }
    });

    return (
        <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
            <Typography variant="h5" sx={{ my: 2 }}>
                Edit Subcategory
            </Typography>
            {!loading && (
                <Box component="form" onSubmit={formik.handleSubmit}>
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Subcategory Name"
                        name="SubCategoryName"
                        value={formik.values.SubCategoryName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.SubCategoryName && Boolean(formik.errors.SubCategoryName)}
                        helperText={formik.touched.SubCategoryName && formik.errors.SubCategoryName}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel id="category-label">Category</InputLabel>
                        <Select
                            labelId="category-label"
                            id="CategoryID"
                            name="CategoryID"
                            value={formik.values.CategoryID}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.CategoryID && Boolean(formik.errors.CategoryID)}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {categories.map(category => (
                                <MenuItem key={category.CategoryID} value={category.CategoryID}>
                                    {category.CategoryName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Box sx={{ mt: 2 }}>
                        <Button variant="contained" type="submit">
                            Update
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
}

export default EditSubCategory;
