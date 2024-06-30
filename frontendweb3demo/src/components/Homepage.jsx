import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Button, Box, CircularProgress } from "@mui/material";

const HomePage = ({ contract, account }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const admin = await contract.methods.admin().call();
        setIsAdmin(admin.toLowerCase() === account.toLowerCase());
      } catch (error) {
        console.error("Error checking admin:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [contract, account]);

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" mt={8}>
        <Typography variant="h4" component="h1" gutterBottom color={"black"}>
          Welcome to the Supply Chain DApp
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : isAdmin ? (
          <Box mt={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/admin-products")}
              style={{ margin: "8px" }}
            >
              My Supplies
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate("/transactions")}
              style={{ margin: "8px" }}
            >
              Transactions
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate("/create-product")}
              style={{ margin: "8px" }}
            >
              Create Product
            </Button>
          </Box>
        ) : (
          <Box mt={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/get-all-products")}
              style={{ margin: "8px" }}
            >
              Products
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default HomePage;
