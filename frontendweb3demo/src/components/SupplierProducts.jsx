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
import { getUserType, buyProduct } from "../scripts/getContract"; 

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
        const allProducts = await contract.methods.getAllProducts().call();
        setProducts(allProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        alert("Failed to fetch products");
      }
    };

    fetchProducts();
  }, [contract]);

  const handleBuyProduct = async (productId) => {
    const qty = parseInt(quantity[productId], 10) || 0;
    if (qty <= 0) {
      alert("Please enter a valid quantity");
      return;
    }

    const product = products.find(p => p.productId === productId);
    const price = product ? product.price : undefined;

    if (!price) {
      alert("Failed to find the product price");
      return;
    }

    const value = BigInt(price) * BigInt(qty);

    try {
      await buyProduct(contract, productId, qty, price, value.toString());
      alert("Product bought successfully!");
      setQuantity({ ...quantity, [productId]: 0 });
    } catch (error) {
      console.error("Error buying product:", error);
      alert("Failed to buy product");
    }
  };

  const handleQuantityChange = (productId, value) => {
    setQuantity({ ...quantity, [productId]: parseInt(value, 10) || "" });
  };

  const handleRowClick = () => {
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
                <TableCell>Price</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Actions</TableCell>
                <TableCell>Quantity</TableCell>
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
                      style={{ width: '90px' }}
                    />
                    </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleBuyProduct(product.productId)}
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
