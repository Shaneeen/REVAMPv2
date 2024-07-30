import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';

function AddCategory() {
  const [categories, setCategories] = useState([]);

  const fetchCategories = () => {
    http.get('/categories')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Failed to fetch categories:', error);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const categoryFormik = useFormik({
    initialValues: {
      CategoryName: '',
      image: null
    },
    validationSchema: yup.object({
      CategoryName: yup.string().required('Category name is required')
    }),
    onSubmit: (data, { resetForm }) => {
      const formData = new FormData();
      formData.append('CategoryName', data.CategoryName);
      if (data.image) {
        formData.append('image', data.image);
      }

      http.post('/categories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(response => {
          console.log(response.data);
          fetchCategories();
          resetForm();
        })
        .catch(error => {
          console.error('Failed to add category:', error);
        });
    }
  });

  const subCategoryFormik = useFormik({
    initialValues: {
      SubCategoryName: '',
      CategoryID: ''
    },
    validationSchema: yup.object({
      SubCategoryName: yup.string().required('Subcategory name is required'),
      CategoryID: yup.string().required('Category is required')
    }),
    onSubmit: (data, { resetForm }) => {
      http.post('/subcategories', data)
        .then(response => {
          console.log(response.data);
          resetForm();
        })
        .catch(error => {
          console.error('Failed to add subcategory:', error);
        });
    }
  });

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Add Category
      </Typography>
      <Box component="form" onSubmit={categoryFormik.handleSubmit}>
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Category Name"
          name="CategoryName"
          variant="outlined"
          value={categoryFormik.values.CategoryName}
          onChange={categoryFormik.handleChange}
          error={categoryFormik.touched.CategoryName && Boolean(categoryFormik.errors.CategoryName)}
          helperText={categoryFormik.touched.CategoryName && categoryFormik.errors.CategoryName}
          InputProps={{ style: { color: 'black' } }}
        />
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          type="file"
          name="image"
          variant="outlined"
          onChange={(event) => categoryFormik.setFieldValue('image', event.currentTarget.files[0])}
          InputProps={{ style: { color: 'black', backgroundColor: 'white' } }}
        />
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" type="submit">
            Add Category
          </Button>
        </Box>
      </Box>

      <Typography variant="h5" sx={{ my: 2, mt: 4 }}>
        Add Subcategory
      </Typography>
      <Box component="form" onSubmit={subCategoryFormik.handleSubmit}>
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Subcategory Name"
          name="SubCategoryName"
          variant="outlined"
          value={subCategoryFormik.values.SubCategoryName}
          onChange={subCategoryFormik.handleChange}
          error={subCategoryFormik.touched.SubCategoryName && Boolean(subCategoryFormik.errors.SubCategoryName)}
          helperText={subCategoryFormik.touched.SubCategoryName && subCategoryFormik.errors.SubCategoryName}
          InputProps={{ style: { color: 'black' } }}
        />
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          select
          SelectProps={{ native: true }}
          label="Category"
          name="CategoryID"
          variant="outlined"
          value={subCategoryFormik.values.CategoryID}
          onChange={subCategoryFormik.handleChange}
          error={subCategoryFormik.touched.CategoryID && Boolean(subCategoryFormik.errors.CategoryID)}
          helperText={subCategoryFormik.touched.CategoryID && subCategoryFormik.errors.CategoryID}
          InputProps={{ style: { color: 'black' } }}
        >
          <option value=""></option>
          {categories.map(category => (
            <option key={category.CategoryID} value={category.CategoryID}>
              {category.CategoryName}
            </option>
          ))}
        </TextField>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" type="submit">
            Add Subcategory
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default AddCategory;
