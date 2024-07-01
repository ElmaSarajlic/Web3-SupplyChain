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

const AllProducts = ({ contract, account }) => {
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminAddress, setAdminAddress] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await contract.methods.getAllProducts().call();
        setProducts(products);
      } catch (error) {
        console.error(error);
        alert("Failed to fetch products");
      }
    };

    const checkAdmin = async () => {
      try {
        const admin = await contract.methods.admin().call();
        setAdminAddress(admin);
        setIsAdmin(admin.toLowerCase() === account.toLowerCase());
      } catch (error) {
        console.error("Error checking admin:", error);
      }
    };

    fetchProducts();
    checkAdmin();
  }, [contract, account]);

  const handleBuyProduct = async (productId, price) => {
    const qty = parseInt(quantity[productId], 10) || 0; 
    if (qty <= 0) {
      alert("Please enter a valid quantity");
      return;
    }
    try {
      const value = BigInt(price) * BigInt(qty); 
      await contract.methods.buyProduct(productId, qty).send({ from: account, value: value.toString() });
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

  const handleAddProduct = () => {
    navigate("/create-product");
  };

  const handleRowClick = (productId) => {
    navigate(`/product-details/${productId}`);
  };

  return (
    <Container>
      <Typography variant="h4" component="h2" gutterBottom>
        All Products
      </Typography>
      {isAdmin && (
        <Button variant="contained" color="primary" onClick={handleAddProduct} style={{ marginBottom: "16px" }}>
          Add New Product
        </Button>
      )}
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
                  onClick={() => handleRowClick(product.productId)}
                  style={{ cursor: "pointer" }}
                >
                  <TableCell>{product.productId.toString()}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.price.toString()}</TableCell>
                  <TableCell>{product.quantity.toString()}</TableCell>
                  <TableCell>{["Created", "InTransit", "Delivered", "Sold"][product.state]}</TableCell>
                  <TableCell>{product.owner}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    {product.owner.toLowerCase() === adminAddress.toLowerCase() && (
                      <Box display="flex" alignItems="center">
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
                      </Box>
                    )}
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
