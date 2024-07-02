import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
} from "@mui/material";

const CreateProduct = ({ contract, account }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateProduct = async () => {
    setLoading(true);
    try {
      if (!contract) {
        alert("Contract not loaded");
        return;
      }
      await contract.methods.createProduct(name, price, quantity).send({ from: account });
      alert("Product created successfully!");
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" mt={8}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create Product
        </Typography>
        <Paper elevation={3} style={{ padding: "16px" }}>
          <TextField
            label="Product Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
          />
          <TextField
            type="number"
            label="Product Price"
            variant="outlined"
            fullWidth
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            margin="normal"
          />
          <TextField
            type="number"
            label="Product Quantity"
            variant="outlined"
            fullWidth
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateProduct}
            disabled={loading}
            size="large"
            style={{ marginTop: "16px" }}
          >
            {loading ? "Creating..." : "Create Product"}
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default CreateProduct;
