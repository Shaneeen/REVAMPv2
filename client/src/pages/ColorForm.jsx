import React from 'react';
import { TextField, Button, Box } from '@mui/material';

function ColorForm({ index, color, removeColor, updateColor }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateColor(index, { ...color, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    updateColor(index, { ...color, image: file });
  };

  return (
    <Box sx={{ my: 2, border: '1px solid #ddd', p: 2 }}>
      <TextField
        fullWidth
        margin="dense"
        autoComplete="off"
        label="Color Name"
        name="ColorName"
        variant="outlined"
        value={color.ColorName}
        onChange={handleInputChange}
      />

      <TextField
        fullWidth
        margin="dense"
        autoComplete="off"
        type="file"
        name="image"
        variant="outlined"
        onChange={handleFileChange}
      />

      <Button variant="contained" sx={{ mt: 2 }} onClick={() => removeColor(index)}>
        Remove Color
      </Button>
    </Box>
  );
}

export default ColorForm;
