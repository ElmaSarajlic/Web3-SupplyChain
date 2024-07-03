import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Typography
} from "@mui/material";

const AllProducts = ({ contract, account }) => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      if (!contract) {
        console.error('Contract is not initialized.');
        return;
      }
      try {
        const fetchedProducts = await contract.methods.getAllProducts().call();
        const filteredProducts = fetchedProducts.filter(product =>
          product.owner.toLowerCase() === account.toLowerCase()        );
        setProducts(filteredProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        alert("Failed to fetch products");
      }
    };

    fetchProducts();
  }, [contract, account]);

  const handleRowClick = (productId) => {
    console.log("Product clicked:", productId);
    // navigate(`/product-details/${productId}`);
  };

  return (
    <Container>
      <Typography variant="h4" component="h2" gutterBottom>
        All Products
      </Typography>
      {products.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Product Price</TableCell>
                <TableCell>Quantity Bought</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Previous Owner</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map(product => (
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
                  <TableCell>{product.previousOwner}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body1">No products found</Typography>
      )}
    </Container>
  );
};

export default AllProducts;
