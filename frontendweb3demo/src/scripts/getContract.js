import initializeWeb3 from "./initializeWeb3";

const web3 = initializeWeb3();

const contractABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_productId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_quantity",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_newPrice",
				"type": "uint256"
			}
		],
		"name": "buyProduct",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_productId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_quantity",
				"type": "uint256"
			}
		],
		"name": "buyProductFromStore",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_quantity",
				"type": "uint256"
			}
		],
		"name": "createProduct",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "productId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "quantity",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "remainingQuantity",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newPrice",
				"type": "uint256"
			}
		],
		"name": "ProductBought",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "productId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "quantity",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "remainingQuantity",
				"type": "uint256"
			}
		],
		"name": "ProductBought",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "productId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "quantity",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "ProductCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "productId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newPrice",
				"type": "uint256"
			}
		],
		"name": "ProductUpdated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_username",
				"type": "string"
			},
			{
				"internalType": "enum SupplyChain.UserType",
				"name": "_userType",
				"type": "uint8"
			}
		],
		"name": "registerUser",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_productId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_newPrice",
				"type": "uint256"
			}
		],
		"name": "updateProductPrice",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "username",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "enum SupplyChain.UserType",
				"name": "userType",
				"type": "uint8"
			}
		],
		"name": "UserRegistered",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "admin",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllProducts",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "productId",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "price",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "quantity",
						"type": "uint256"
					},
					{
						"internalType": "enum SupplyChain.State",
						"name": "state",
						"type": "uint8"
					},
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "previousOwner",
						"type": "address"
					}
				],
				"internalType": "struct SupplyChain.ProductWithID[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_productId",
				"type": "uint256"
			}
		],
		"name": "getProduct",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "enum SupplyChain.State",
				"name": "",
				"type": "uint8"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "storeAddress",
				"type": "address"
			}
		],
		"name": "getStoreProducts",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "productId",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "price",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "quantity",
						"type": "uint256"
					},
					{
						"internalType": "enum SupplyChain.State",
						"name": "state",
						"type": "uint8"
					},
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "previousOwner",
						"type": "address"
					}
				],
				"internalType": "struct SupplyChain.ProductWithID[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			}
		],
		"name": "getUserType",
		"outputs": [
			{
				"internalType": "enum SupplyChain.UserType",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			}
		],
		"name": "isUserRegistered",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "productCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "products",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "quantity",
				"type": "uint256"
			},
			{
				"internalType": "enum SupplyChain.State",
				"name": "state",
				"type": "uint8"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "userProductQuantities",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const contractAddress = "0x1d418140CD69732aB02628952f8F854ac434a9Bd"; 

const getContract = (web3) => {
    return new web3.eth.Contract(contractABI, contractAddress);
};

export default getContract;

export const createProduct = async (contract, name, price, quantity) => {
    try {
        const accounts = await web3.eth.getAccounts();
        const adminAccount = accounts[0];

        await contract.methods.createProduct(name, price, quantity).send({ from: adminAccount });
        console.log("Product created successfully");
    } catch (error) {
        console.error(error);
    }
};

export const getAllProducts = async (contract) => {
    try {
        const products = await contract.methods.getAllProducts().call();
        return products.map(product => ({
            productId: product.productId,
            name: product.name,
            price: parseInt(product.price),
            quantity: parseInt(product.quantity),
            state: product.state,
            owner: product.owner,
			previousOwner: product.previousOwner
        }));
    } catch (error) {
        console.error(error);
    }
};

export const buyProduct = async (contract, productId, quantity, newPrice, accountType) => {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    
    let priceToUse = newPrice;
    
    const product = await contract.methods.getProduct(productId).call();
    if (!newPrice && product) {
        priceToUse = product.price;
    }
    
    const value = BigInt(priceToUse) * BigInt(quantity);

    try {
        let actualValue = value;
        if (accountType === "Store") {
            actualValue = BigInt(product.price) * BigInt(quantity);
        }

        await contract.methods.buyProduct(productId, quantity, priceToUse).send({
            from: account,
            value: actualValue.toString() 
        });
        console.log("Product bought successfully, possibly with new pricing");
    } catch (error) {
        console.error("Error buying product:", error);
        throw error; 
    }
};

export const getAdmin = async (contract) => {
    try {
        const adminAddress = await contract.methods.admin().call();
        return adminAddress;
    } catch (error) {
        console.error(error);
    }
};

export const getProductCount = async (contract) => {
    try {
        const count = await contract.methods.productCount().call();
        return parseInt(count);
    } catch (error) {
        console.error(error);
    };
};

export const getProductDetails = async (contract, productId) => {
		try {
			const product = await contract.methods.getProduct(productId).call();
			return {
				name: product[0],
				price: parseInt(product[1]),
				quantity: parseInt(product[2]),
				state: product[3],
				owner: product[4]
				
			};
		} catch (error) {
			console.error(error);
		}
	};

	export const registerUser = async (contract, username, userType) => {
		try {
			const accounts = await web3.eth.getAccounts();
			await contract.methods.registerUser(username, userType).send({ from: accounts[0] });
			console.log("User registered successfully");
		} catch (error) {
			console.error("Error registering user:", error);
			throw error
		}};	

	export const isUserRegistered = async (contract, address, userType) => {
		try {
			const isRegistered = await contract.methods.isUserRegistered(address).call();
			return isRegistered;
		} catch (error) {
			console.error("Error checking if user is registered:", error);
			throw error;
		}
	};
	


	export const getStoreProducts = async (contract, storeAddress) => {
		try {
			const products = await contract.methods.getStoreProducts(storeAddress).call();
			return products.map(product => ({
				productId: product.productId,
				name: product.name,
				price: parseInt(product.price),
				quantity: parseInt(product.quantity),
				state: product.state,
				owner: product.owner,
				previousOwner: product.previousOwner
			}));
		} catch (error) {
			console.error("Error fetching store products:", error);
		}
	};

	export const getUserType = async (contract, userAddress) => {
		try {
			const userType = await contract.methods.getUserType(userAddress).call();
			console.log("User type retrieved:", userType);
			return userType;
		} catch (error) {
			console.error("Error fetching user type:", error);
			throw error;  
		}
	};
	
	export const buyProductFromStore = async (contract, productId, quantity, pricePerItem) => {
		try {
			const accounts = await web3.eth.getAccounts();
			if (!accounts.length) throw new Error("No Ethereum accounts available.");
			const account = accounts[0];
	
			const value = BigInt(quantity) * BigInt(pricePerItem);  
	
			await contract.methods.buyProductFromStore(productId, quantity)
				.send({ from: account, value: value.toString() });
	
			console.log("Product purchased from store successfully");
	
		} catch (error) {
			console.error("Error purchasing product from store:", error);
			alert("Failed to purchase product: " + error.message);  
			throw error;
		}
	};
	
	export const updateProductPrice = async (contract, productId, newPrice, account) => {
		try {
			const response = await contract.methods.updateProductPrice(productId, newPrice).send({ from: account });
			console.log("Product price updated successfully:", response);
		} catch (error) {
			console.error("Failed to update product price:", error);
			throw error; 
		}
	};
	

	
		