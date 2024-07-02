import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { getUserType, buyProductFromStore } from "../scripts/getContract"; 

const AllProducts = ({ contract, account }) => {
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      if (!contract) {
        console.error('Contract is not initialized.');
        return;
      }
      try {
        const fetchedProducts = await contract.methods.getAllProducts().call();
        const filteredProducts = await Promise.all(
          fetchedProducts.map(async product => {
            const userType = await contract.methods.getUserType(product.owner).call();
            return userType === 1n ? product : null;
          })
        );
        setProducts(filteredProducts.filter(product => product !== null));
      } catch (error) {
        console.error("Failed to fetch products:", error);
        alert("Failed to fetch data");
      }
    };

    fetchProducts();
  }, [contract, account]);

  const handleQuantityChange = (productId, value) => {
    setQuantity({ ...quantity, [productId]: parseInt(value, 10) || "" });
  };

  const handleBuyProduct = async (productId, price) => {
    const qty = parseInt(quantity[productId], 10) || 0;
    if (qty <= 0) {
      alert("Please enter a valid quantity");
      return;
    }
    try {
      const value = BigInt(price) * BigInt(qty);
      await buyProductFromStore(contract, productId, qty, value.toString());
      alert("Product purchased successfully!");
      setProducts(prevProducts => prevProducts.map(p => {
        if (p.productId === productId) {
          return { ...p, quantity: p.quantity - qty };
        }
        return p;
      }));
      setQuantity({ ...quantity, [productId]: 0 });
    } catch (error) {
      console.error("Error purchasing product:", error);
      alert("Failed to purchase product");
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h2" gutterBottom>
        Products from UserType 1n
      </Typography>
      {products.length > 0 ? (
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
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow
                  key={product.productId}
                  hover
                  // onClick={() => navigate(`/product-details/${product.productId}`)}
                  style={{ cursor: "pointer" }}
                >
                  <TableCell>{product.productId.toString()}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.price.toString()}</TableCell>
                  <TableCell>{product.quantity.toString()}</TableCell>
                  <TableCell>{["Created", "InTransit", "Delivered", "Sold"][product.state]}</TableCell>
                  <TableCell>{product.owner}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      label="Quantity"
                      variant="outlined"
                      size="small"
                      value={quantity[product.productId] || ""}
                      onChange={(e) => handleQuantityChange(product.productId, e.target.value)}
                      style={{ marginRight: "8px" }}
                    />
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleBuyProduct(product.productId, product.price)}
                    >
                      Buy
                    </Button>
                  </TableCell>
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
