import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import CreateProduct from "./components/CreateProduct";
import GetAllProducts from "./components/GetAllProducts";
import ProductDetails from "./components/ProductDetails";
import Registration from "./components/Registration";
import UpdateState from "./components/UpdateState";
import Transactions from "./components/Transactions";

import Login from "./components/Login";
import initializeWeb3 from "./scripts/initializeWeb3";
import getContract from "./scripts/getContract";

import "./App.css";
import AdminProducts from "./components/AdminProducts";
import HomePage from "./components/Homepage";

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const navigate = useNavigate();

  const handleConnect = async () => {

    try {
      const web3Instance = initializeWeb3();
      if (!web3Instance) return;

      const accounts = await web3Instance.eth.getAccounts();
      const account = accounts[0];

      setWeb3(web3Instance);
      setAccount(account);

      const contractInstance = getContract(web3Instance);
      setContract(contractInstance);

      // navigate("/get-all-products");
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
    }
  };

  return (
    <div>
      {/* <button onClick={handleConnect}>Connect Wallet</button> */}

      <Routes>
        <Route path="/" element={<Login setUser={setAccount} setContract={setContract} />} />
        <Route path="/create-product" element={<CreateProduct contract={contract} account={account} />} />
        <Route path="/get-all-products" element={<GetAllProducts contract={contract} account={account} />} />
        <Route path="/admin-products" element={<AdminProducts contract={contract} account={account} />} />
        <Route path="/transactions" element={<Transactions contract={contract} account={account} />} />
        <Route path="/homepage" element={<HomePage contract={contract} account={account} />} />
        <Route path="/product-details/:productId" element={<ProductDetails contract={contract} />} />

        <Route path="/product-details" element={<ProductDetails contract={contract} />} />
        <Route path="/registration" element={<Registration setUser={setAccount} setContract={setContract} />} />
        <Route path="/update-state" element={<UpdateState contract={contract} account={account} />} />
      </Routes>
    </div>
  );
};

const WrappedApp = () => (
  <Router>
    <App />
  </Router>
);

export default WrappedApp;
