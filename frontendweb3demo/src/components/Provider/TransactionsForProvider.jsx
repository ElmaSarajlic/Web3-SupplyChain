import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper
} from "@mui/material";
import { getAllProducts } from "../../scripts/getContract";
import getContract from "../../scripts/getContract";
import initializeWeb3 from "../../scripts/initializeWeb3";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initWeb3AndContract = async () => {
      try {
        const web3 = initializeWeb3();
        if (!web3) {
          alert('Web3 is not initialized. Please install MetaMask!');
          return;
        }

        const accounts = await web3.eth.getAccounts();
        if (accounts.length === 0) {
          alert('No accounts found. Please unlock MetaMask!');
          return;
        }
        setAccount(accounts[0]);

        const contractInstance = getContract(web3);
        setContract(contractInstance);
      } catch (error) {
        console.error("Initialization error:", error);
        alert("Initialization error: " + error.message);
      }
    };

    initWeb3AndContract();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (contract && account) {
        try {
          const allProducts = await getAllProducts(contract);
          const relevantProducts = allProducts.filter(product => 
            product.previousOwner.toLowerCase() === account.toLowerCase()
          );
          setProducts(relevantProducts);
        } catch (error) {
          console.error("Error fetching products:", error);
          alert("Failed to fetch products: " + error.message);
        }
      }
    };

    fetchProducts();
  }, [contract, account]);

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
                <TableCell>Quantity Bought</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Previous Owner</TableCell>
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
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
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
