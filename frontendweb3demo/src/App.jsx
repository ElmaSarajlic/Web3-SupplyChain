import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import CreateProduct from "./components/Provider/CreateProduct";
import StoreOwnedProducts from "./components/Store/StoreOwnedProducts";
import ProductDetails from "./components/ProductDetails";
import Registration from "./components/Registration";
import TransactionsForProvider from "./components/Provider/TransactionsForProvider";
import ProviderTransactions from "./components/ProviderTransactions";
import ProviderProductsForStore from "./components/Store/ProviderProductsForStore";
import SupplierProducts from "./components/Provider/SupplierProducts";
import UserBoughtProducts from "./components/Store/UserBoughtProducts";
import UserOwnedTransactions from "./components/User/UserOwnedTransactions";


import Stores from "./components/User/Stores";


import Login from "./components/Login";
import initializeWeb3 from "./scripts/initializeWeb3";
import getContract from "./scripts/getContract";

import "./App.css";
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
      <button onClick={handleConnect}>Connect Wallet</button>

      <Routes>
        <Route path="/" element={<Login setUser={setAccount} setContract={setContract} />} />
        <Route path="/create-product" element={<CreateProduct contract={contract} account={account} />} />
        <Route path="/StoreOwnedProducts" element={<StoreOwnedProducts contract={contract} account={account} />} />
        <Route path="/transactionsForProvider" element={<TransactionsForProvider contract={contract} account={account} />} />
        <Route path="/homepage" element={<HomePage contract={contract} account={account} />} />
        <Route path="/product-details/:productId" element={<ProductDetails contract={contract} />} />
        <Route path="/supplier-products" element={<SupplierProducts contract={contract} account={account} />} />
        <Route path="/stores" element={<Stores contract={contract} account={account} />} />
        <Route path="/provider-transactions" element={<ProviderTransactions contract={contract} account={account} />} />
        <Route path="/providerProductsForStore" element={<ProviderProductsForStore contract={contract} account={account} />} />
        <Route path="/UserBoughtProducts" element={<UserBoughtProducts contract={contract} account={account} />} />
        <Route path="/UserOwnedTransactions" element={<UserOwnedTransactions contract={contract} account={account} />} />

        <Route path="/product-details" element={<ProductDetails contract={contract} />} />
        <Route path="/registration" element={<Registration setUser={setAccount} setContract={setContract} />} />
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
