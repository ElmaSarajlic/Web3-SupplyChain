import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import {
  Container,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import getContract, { registerUser } from "../scripts/getContract";

const Registration = ({ setUser, setContract }) => {
  const [username, setUsername] = useState("");
  const [userType, setUserType] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    setLoading(true);
    try {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();

        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];

        const contractInstance = getContract(web3);
        setContract(contractInstance);

        await registerUser(contractInstance, username, userType);
        alert("User registered successfully. You can now log in.");
        navigate("/");
      } else {
        alert("Please install MetaMask!");
      }
    } catch (error) {
      console.error("Error during registration:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" mt={8}>
        <Typography variant="h4" component="h1" gutterBottom>
          Register
        </Typography>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>User Type</InputLabel>
          <Select
            value={userType}
            label="User Type"
            onChange={(e) => setUserType(e.target.value)}
          >
            <MenuItem value={0}>User</MenuItem>
            <MenuItem value={1}>Store</MenuItem>
            <MenuItem value={2}>Provider</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={handleRegister}
          disabled={loading || !username || userType === ''}
          size="large"
        >
          {loading ? <CircularProgress size={24} /> : "Register"}
        </Button>
      </Box>
    </Container>
  );
};

export default Registration;
