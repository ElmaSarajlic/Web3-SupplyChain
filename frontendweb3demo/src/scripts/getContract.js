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
		"inputs": [
			{
				"internalType": "string",
				"name": "_username",
				"type": "string"
			}
		],
		"name": "registerUser",
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

const contractAddress = "0xf0c878044fd6719c2ff6c569c1c976fff90b9949"; 

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
            owner: product.owner
        }));
    } catch (error) {
        console.error(error);
    }
};

export const buyProduct = async (contract, productId, quantity, value) => {
    try {
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];

        await contract.methods.buyProduct(productId, quantity).send({ from: account, value: value });
        console.log("Product bought successfully");
    } catch (error) {
        console.error(error);
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

	export const registerUser = async (contract, username) => {
		try {
			const accounts = await web3.eth.getAccounts();
			const userAccount = accounts[0];
	
			await contract.methods.registerUser(username).send({ from: userAccount });
			console.log("User registered successfully");
		} catch (error) {
			console.error(error);
		}
	};

	export const isUserRegistered = async (contract, address) => {
		try {
			const isRegistered = await contract.methods.isUserRegistered(address).call();
			return isRegistered;
		} catch (error) {
			console.error("Error checking if user is registered:", error);
			throw error;
		}
	};
	