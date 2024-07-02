import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Button, Box, CircularProgress } from "@mui/material";

const HomePage = ({ contract, account }) => {
  const [userType, setUserType] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const type = await contract.methods.getUserType(account).call();
        setUserType(type);
      } catch (error) {
        console.error("Error fetching user type:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserType();
  }, [contract, account]);

  const renderButtonsForUser = () => (
    <Box mt={4}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/stores")}
        style={{ margin: "8px" }}
      >
        Store Products
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate("/user-transactions")}
        style={{ margin: "8px" }}
      >
        My Transactions
      </Button>
    </Box>
  );

  const renderButtonsForStore = () => (
    <Box mt={4}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/supplier-products")}
        style={{ margin: "8px" }}
      >
        Providers' Products
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate("/get-all-products")}
        style={{ margin: "8px" }}
      >
        My Products
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate("/store-transactions")}
        style={{ margin: "8px" }}
      >
        Transactions
      </Button>
    </Box>
  );

  const renderButtonsForProvider = () => (
    <Box mt={4}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/transactionsForProvider")}
        style={{ margin: "8px" }}
      >
        Transactions
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate("/transactions")}
        style={{ margin: "8px" }}
      >
        My Products
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
  );

  const renderButtonsForAdmin = () => (
    <Box mt={4}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/get-all-products")}
        style={{ margin: "8px" }}
      >
        All Transactions
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate("/all-products")}
        style={{ margin: "8px" }}
      >
        All Products
      </Button>
    </Box>
  );

  const renderUserInterface = () => {
    switch (userType) {
      case 0n:
        return renderButtonsForUser();
      case 1n:
        return renderButtonsForStore();
      case 2n:
        return renderButtonsForProvider();
      case "admin":
        return renderButtonsForAdmin();
      default:
        return <Typography variant="h6">Unauthorized Access</Typography>;
    }
  };

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" mt={8}>
        <Typography variant="h4" component="h1" gutterBottom color={"black"}>
          Welcome to the Supply Chain DApp
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          renderUserInterface()
        )}
      </Box>
    </Container>
  );
};

export default HomePage;
