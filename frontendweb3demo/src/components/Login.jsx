import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import {
  Container,
  Typography,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import getContract, { isUserRegistered, getUserType } from "../scripts/getContract";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        const contractInstance = getContract(web3);

        const registered = await isUserRegistered(contractInstance, account);
        if (registered) {
          const userType = await getUserType(contractInstance, account);
          switch (userType) {
            case 0n: // Assuming 0 is User
              navigate("/homepage");
              break;
            case 1n: // Assuming 1 is Store
              navigate("/homepage");
              break;
            case 2n: // Assuming 2 is Provider
              navigate("/homepage");
              break;
            case admin: // Assuming 2 is Provider
            navigate("/homepage");
            break;
            default:
              alert("Invalid user type");
              break;
          }
        } else {
          alert("User not registered. Please register first.");
          navigate("/registration");
        }
      } else {
        alert("Please install MetaMask!");
      }
    } catch (error) {
      console.error("Error during login:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" mt={8}>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          disabled={loading}
          size="large"
        >
          {loading ? <CircularProgress size={24} /> : "Login"}
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
