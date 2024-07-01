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

const AdminProducts = ({ contract, account }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminAddress, setAdminAddress] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await contract.methods.getAllProducts().call();
        setProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
        alert("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    const checkAdmin = async () => {
      try {
        const admin = await contract.methods.admin().call();
        setAdminAddress(admin);
      } catch (error) {
        console.error("Error checking admin:", error);
      }
    };

    fetchProducts();
    checkAdmin();
  }, [contract]);

  const adminProducts = products.filter(
    (product) => product.owner.toLowerCase() === adminAddress.toLowerCase()
  );

  const handleRowClick = (productId) => {
    navigate(`/product-details/${productId}`);
  };

  return (
    <Container maxWidth="md">
      <Box textAlign="center" mt={8}>
        <Typography variant="h4" component="h1" gutterBottom color={"black"}>
          Admin Products
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : adminProducts.length > 0 ? (
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
                {adminProducts.map((product) => (
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
          <Typography variant="body1">No products found</Typography>
        )}
      </Box>
    </Container>
  );
};

export default AdminProducts;
