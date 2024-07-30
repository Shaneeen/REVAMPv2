import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';

function EditCategory() {
  const { CategoryID } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState({
    CategoryName: '',
    image: null,
    ImageURL: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    http.get(`/categories/${CategoryID}`).then((res) => {
      const categoryData = res.data;
      setCategory(categoryData);
      console.log('Category Data:', categoryData);  // Add this line to check category data
      setLoading(false);
    }).catch(error => {
      console.error('Error fetching category data:', error);
    });
  }, [CategoryID]);

  const formik = useFormik({
    initialValues: category,
    enableReinitialize: true,
    validationSchema: yup.object({
      CategoryName: yup.string().required('Category name is required'),
    }),
    onSubmit: (data) => {
      const formData = new FormData();
      formData.append('CategoryName', data.CategoryName);
      if (data.image) {
        formData.append('image', data.image);
      }

      http.put(`/categories/${CategoryID}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(res => {
        console.log(res.data);
        navigate("/categories");
      })
      .catch(error => {
        console.error('Error updating category:', error);
      });
    }
  });

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteCategory = () => {
    http.delete(`/categories/${CategoryID}`)
      .then((res) => {
        console.log(res.data);
        navigate("/categories");
      })
      .catch(error => {
        console.error('Error deleting category:', error);
      });
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Edit Category
      </Typography>
      {
        !loading && (
          <Box component="form" onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth margin="dense" autoComplete="off"
              label="Category Name"
              name="CategoryName"
              value={formik.values.CategoryName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.CategoryName && Boolean(formik.errors.CategoryName)}
              helperText={formik.touched.CategoryName && formik.errors.CategoryName}
              InputProps={{ style: { color: 'black' } }}
            />
            <TextField
              fullWidth margin="dense" autoComplete="off"
              type="file"
              name="image"
              onChange={(event) => formik.setFieldValue('image', event.currentTarget.files[0])}
              InputProps={{ style: { color: 'black', backgroundColor: 'white' } }}
            />
            {category.ImageURL && (
              <Box sx={{ my: 2 }}>
                <img src={category.ImageURL} alt="Category" style={{ maxWidth: '100%' }} />
              </Box>
            )}
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
          Delete Category
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this category?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="inherit" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={deleteCategory}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EditCategory;