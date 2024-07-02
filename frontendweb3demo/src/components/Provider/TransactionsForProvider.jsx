import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { getUserType } from "../../scripts/getContract"; 

const AllProducts = ({ contract }) => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (!contract) {
          console.error('Contract is not initialized.');
          return;
        }

        const allProducts = await contract.methods.getAllProducts().call();
        const filteredProducts = await Promise.all(
          allProducts.map(async (product) => {
            const userType = await getUserType(contract, product.owner);
            return (userType === "Store" || userType === 1n) ? product : null;
          })
        );
        setProducts(filteredProducts.filter(product => product != null));
      } catch (error) {
        console.error("Error fetching products:", error);
        alert("Failed to fetch products");
      }
    };

    fetchProducts();
  }, [contract]);

  const handleRowClick = (productId) => {
    navigate(`/product-details/${productId}`);
  };

  return (
    <Container>
      <Typography variant="h4" component="h2" gutterBottom>
        Store Products
      </Typography>
      {products.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Available Quantity</TableCell>
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
        <Typography variant="body1">No products found</Typography>
      )}
    </Container>
  );
};

export default AllProducts;
