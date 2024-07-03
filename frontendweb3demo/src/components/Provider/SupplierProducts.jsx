import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button, Container, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Typography,
  Box, Modal, TextField
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

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [newPrice, setNewPrice] = useState("");
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initWeb3AndContract = async () => {
      try {
        const web3Instance = initializeWeb3();
        if (!web3Instance) {
          alert('Web3 is not initialized. Please install MetaMask!');
          return;
        }
        setWeb3(web3Instance);

        const accounts = await web3Instance.eth.getAccounts();
        if (accounts.length === 0) {
          alert('No accounts found. Please unlock MetaMask!');
          return;
        }
        setAccount(accounts[0]);

        const contractInstance = getContract(web3Instance);
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
          const fetchedProducts = await contract.methods.getAllProducts().call();
          const relevantProducts = fetchedProducts.filter(product =>
            product.owner.toLowerCase() === account.toLowerCase() ||
            product.previousOwner.toLowerCase() === account.toLowerCase() && product.state === 'Sold'
          );
          setProducts(relevantProducts);
        } catch (error) {
          console.error("Failed to fetch products:", error);
          alert("Failed to fetch products: " + error.message);
        }
      }
    };

    fetchProducts();
  }, [contract, account]);

  const handleRowClick = productId => {
    console.log("Product clicked: ", productId);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const handlePriceSubmit = async () => {
    if (!newPrice || !currentProduct) return;
    try {
      await contract.methods.updateProductPrice(currentProduct.productId, newPrice).send({ from: account });
      alert("Price updated successfully");
      setModalOpen(false);
      setProducts(products.map(p => p.productId === currentProduct.productId ? { ...p, price: newPrice } : p));
      setNewPrice("");
    } catch (error) {
      console.error("Failed to update price:", error);
      alert("Failed to update price");
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h2" gutterBottom>
        All Products
      </Typography>
      <Modal
        open={modalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Update Price
          </Typography>
          <TextField
            fullWidth
            label="New Price"
            value={newPrice}
            onChange={e => setNewPrice(e.target.value)}
            type="number"
            margin="normal"
          />
          <Button onClick={handlePriceSubmit} variant="contained" color="primary" style={{ marginTop: '20px' }}>
            Update Price
          </Button>
        </Box>
      </Modal>
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
