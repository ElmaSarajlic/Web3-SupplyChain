import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Paper,
} from "@mui/material";

const ProductDetails = ({ contract }) => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await contract.methods.getProduct(productId).call();
        setProduct({
          name: product[0],
          price: parseInt(product[1]),
          quantity: parseInt(product[2]),
          state: ["Created", "InTransit", "Delivered", "Sold"][product[3]],
          owner: product[4],
        });
      } catch (error) {
        console.error("Error fetching product details:", error);
        alert("Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [contract, productId]);

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" mt={8}>
        <Typography variant="h4" component="h1" gutterBottom color={"black"}>
          Product Details
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          product && (
            <Paper elevation={3} style={{ padding: "16px", marginTop: "16px" }}>
              <Typography variant="h6" component="h2">
                Name: {product.name}
              </Typography>
              <Typography variant="body1">Price: {product.price}</Typography>
              <Typography variant="body1">Quantity: {product.quantity}</Typography>
              <Typography variant="body1">State: {product.state}</Typography>
              <Typography variant="body1">Owner: {product.owner}</Typography>
            </Paper>
          )
        )}
      </Box>
    </Container>
  );
};

export default ProductDetails;
