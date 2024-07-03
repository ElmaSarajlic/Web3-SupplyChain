import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Typography
} from "@mui/material";
import getContract from "../../scripts/getContract";

import initializeWeb3 from "../../scripts/initializeWeb3";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const AllProducts = ({ }) => {
  const [products, setProducts] = useState([]);

  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null); 
  const navigate = useNavigate();
  

  useEffect(() => {

    const initWeb3 = async () => {
        try {
            const web3 = initializeWeb3();
            if (!web3) {
                throw new Error('Web3 not initialized. Ensure MetaMask is installed.');
            }
            setWeb3(web3);

            const accounts = await web3.eth.getAccounts();
            if (accounts.length === 0) {
                throw new Error('No accounts found. Ensure MetaMask is unlocked.');
            }
            setAccount(accounts[0]);

            const contractInstance = getContract(web3);
            setContract(contractInstance);
        } catch (error) {
            console.error("Initialization error:", error.message);
            alert(error.message);
        }
    };

    initWeb3();
}, []);

useEffect(() => {
    const fetchProducts = async () => {
        if (!contract) {
            console.log('Contract not set.');
            return;
        }
        if (!account) {
            console.log('Account not set.');
            return;
        }
        try {
            const fetchedProducts = await contract.methods.getAllProducts().call();
            const relevantProducts = fetchedProducts.filter(product =>
                product.previousOwner.toLowerCase() === account.toLowerCase()
            );
            setProducts(relevantProducts);
        } catch (error) {
            console.error("Failed to fetch products:", error);
            alert("Failed to fetch data");
        }
    };

    if (contract && account) {
        fetchProducts();
    }
}, [contract, account]);

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
                <TableCell>Quantity</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Owner</TableCell>
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
