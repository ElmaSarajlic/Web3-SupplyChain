import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
} from "@mui/material";
import { getUserType } from "../scripts/getContract"; 
const StoreProducts = ({ contract, account }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const allProducts = await contract.methods.getAllProducts().call();
        const storeProducts = await Promise.all(
          allProducts.map(async (product) => {
            const ownerType = await getUserType(contract, product.owner);
            if (ownerType === "Store" || ownerType === 1n) {
              return product;
            }
            return null;
          })
        );
        setProducts(storeProducts.filter(product => product !== null));
      } catch (error) {
        console.error("Error fetching products:", error);
        alert("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [contract]);

  const handleRowClick = productId => {
    navigate(`/product-details/${productId}`);
  };

  return (
    <Container maxWidth="md">
      <Box textAlign="center" mt={8}>
        <Typography variant="h4" component="h1" gutterBottom>
          Store Products
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : products.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>State</TableCell>
                  <TableCell>Owner</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow
                    key={product.productId}
                    hover
                    onClick={() => handleRowClick(product.productId)}
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell>{product.productId.toString()}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.price.toString()}</TableCell>
                    <TableCell>{product.quantity.toString()}</TableCell>
                    <TableCell>{["Created", "InTransit", "Delivered", "Sold"][product.state]}</TableCell>
                    <TableCell>{product.owner}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body1">No store products found</Typography>
        )}
      </Box>
    </Container>
  );
};

export default StoreProducts;
