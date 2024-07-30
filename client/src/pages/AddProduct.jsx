import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, MenuItem, FormControl, Autocomplete, Chip } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { useNavigate } from 'react-router-dom';

function AddProduct() {
  const navigate = useNavigate();
  const [subCategories, setSubCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [productName, setProductName] = useState('');

  useEffect(() => {
    http.get('/subcategories')
      .then(response => {
        setSubCategories(response.data);
      })
      .catch(error => {
        console.error('Failed to fetch subcategories:', error);
      });
  }, []);

  const formik = useFormik({
    initialValues: {
      ProductName: '',
      Description: '',
      BasePrice: '',
      Type: '',
      SubCategories: []
    },
    validationSchema: yup.object({
      ProductName: yup.string().required('Product name is required'),
      Description: yup.string().required('Description is required'),
      BasePrice: yup.number().required('Base price is required').positive('Base price must be a positive number'),
      Type: yup.string().required('Type is required').oneOf(['bestseller', 'newest', 'normal'], 'Invalid type specified'),
      SubCategories: yup.array().min(1, 'At least one subcategory is required').of(yup.object({
        SubCategoryID: yup.number().required(),
        SubCategoryName: yup.string().required()
      })).required('At least one subcategory is required')
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

        const productResponse = await http.post('/products', postData);
        const productID = productResponse.data.ProductID;

        for (const color of colors) {
          const formData = new FormData();
          formData.append('ProductID', productID);
          formData.append('ProductName', productName);
          formData.append('ColorName', color.name);
          formData.append('image', color.image);

          await http.post('/colors', formData);
        }

        navigate("/products");
      } catch (error) {
        console.error('Error:', error);
      }
    }
  });

  const handleAddColor = () => {
    setColors([...colors, { name: '', image: null }]);
  };

  const handleColorNameChange = (index, value) => {
    const newColors = [...colors];
    newColors[index].name = value;
    setColors(newColors);
  };

  const handleColorImageChange = (index, file) => {
    const newColors = [...colors];
    newColors[index].image = file;
    setColors(newColors);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', my: 4 }}>
      <Typography variant="h5" sx={{ my: 2 }}>
        Add Product
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Product Name"
          name="ProductName"
          variant="outlined"
          value={formik.values.ProductName}
          onChange={(e) => {
            formik.handleChange(e);
            setProductName(e.target.value);
          }}
          error={formik.touched.ProductName && Boolean(formik.errors.ProductName)}
          helperText={formik.touched.ProductName && formik.errors.ProductName}
          InputProps={{ style: { color: 'black', backgroundColor: 'white' } }}
        />

        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          multiline
          minRows={2}
          label="Description"
          name="Description"
          variant="outlined"
          value={formik.values.Description}
          onChange={formik.handleChange}
          error={formik.touched.Description && Boolean(formik.errors.Description)}
          helperText={formik.touched.Description && formik.errors.Description}
          InputProps={{ style: { color: 'black', backgroundColor: 'white' } }}
        />

        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Base Price"
          name="BasePrice"
          variant="outlined"
          type="number"
          value={formik.values.BasePrice}
          onChange={formik.handleChange}
          error={formik.touched.BasePrice && Boolean(formik.errors.BasePrice)}
          helperText={formik.touched.BasePrice && formik.errors.BasePrice}
          InputProps={{ style: { color: 'black', backgroundColor: 'white' } }}
        />

        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Type"
          name="Type"
          select
          SelectProps={{ native: true }}
          variant="outlined"
          value={formik.values.Type}
          onChange={formik.handleChange}
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
                    value.map((option, index) => (
                        <Chip
                            key={option.SubCategoryID}
                            label={option.SubCategoryName}
                            {...getTagProps({ index })}
                            sx={{ color: 'black', backgroundColor: '#f0f0f0' }}
                        />
                    ))
                }
                ListboxProps={{
                    style: { color: 'black', backgroundColor: 'white' }
                }}
            />
        </FormControl>

        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Add Colors
          </Typography>
          {colors.map((color, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                margin="dense"
                autoComplete="off"
                label="Color Name"
                value={color.name}
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
            Add Product
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default AddProduct;
