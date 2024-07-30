import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import http from '../http';

function AddColor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isAdding, setIsAdding] = useState(true);

  const formik = useFormik({
    initialValues: {
      colorName: '',
      colorImage: null
    },
    validationSchema: yup.object({
      colorName: yup.string().required('Color name is required'),
      colorImage: yup.mixed().required('Image is required')
    }),
    onSubmit: (data) => {
      const formData = new FormData();
      formData.append('colorName', data.colorName);
      formData.append('colorImage', data.colorImage);

      http.post(`/products/${id}/colors`, formData)
        .then(() => {
          if (isAdding) {
            formik.resetForm();
          } else {
            navigate('/products');
          }
        })
        .catch(error => {
          console.error('Failed to add color:', error);
        });
    }
  });

  const handleFileChange = (event) => {
    formik.setFieldValue('colorImage', event.currentTarget.files[0]);
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Add Color
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Color Name"
          name="colorName"
          variant="outlined"
          value={formik.values.colorName}
          onChange={formik.handleChange}
          error={formik.touched.colorName && Boolean(formik.errors.colorName)}
          helperText={formik.touched.colorName && formik.errors.colorName}
        />

        <input
          type="file"
          name="colorImage"
          onChange={handleFileChange}
          accept="image/*"
          style={{ marginTop: 16 }}
        />
        {formik.errors.colorImage && formik.touched.colorImage ? (
          <div style={{ color: 'red' }}>{formik.errors.colorImage}</div>
        ) : null}

        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            type="submit"
            onClick={() => setIsAdding(true)}
            sx={{ mr: 1 }}
          >
            Add Another Color
          </Button>
          <Button
            variant="contained"
            type="submit"
            onClick={() => setIsAdding(false)}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default AddColor;
