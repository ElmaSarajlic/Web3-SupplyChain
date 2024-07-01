// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract SupplyChain {
    address public admin;

    enum State { Created, InTransit, Delivered, Sold }
    
    struct Product {
        string name;
        uint256 price;
        uint256 quantity;
        State state;
        address owner;
    }

    struct User {
        address userAddress;
        string username;
        bool isRegistered;
    }

    struct ProductWithID {
        uint256 productId;
        string name;
        uint256 price;
        uint256 quantity;
        State state;
        address owner;
    }

    mapping(uint256 => Product) public products;
    mapping(address => User) private users;
    mapping(address => mapping(uint256 => uint256)) public userProductQuantities;

    uint256 public productCount;

    event ProductCreated(uint256 productId, string name, uint256 price, uint256 quantity, address owner);
    event ProductBought(uint256 productId, address newOwner, uint256 quantity, uint256 remainingQuantity);
    event UserRegistered(address userAddress, string username);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only the contract admin can perform this action");
        _;
    }

    modifier onlyRegisteredUser() {
        require(users[msg.sender].isRegistered, "User not registered");
        _;
    }

    modifier productExists(uint256 productId) {
        require(productId < productCount, "Product does not exist");
        _;
    }

    constructor() {
        admin = msg.sender;
        users[admin] = User({
            userAddress: admin,
            username: "Admin",
            isRegistered: true
        });
        emit UserRegistered(admin, "Admin");
    }

    function registerUser(string memory _username) public {
        require(!users[msg.sender].isRegistered, "User already registered");
        users[msg.sender] = User({
            userAddress: msg.sender,
            username: _username,
            isRegistered: true
        });
        emit UserRegistered(msg.sender, _username);
    }

    function isUserRegistered(address userAddress) public view returns (bool) {
        return users[userAddress].isRegistered;
    }

    function createProduct(string memory _name, uint256 _price, uint256 _quantity) public onlyAdmin {
        products[productCount] = Product({
            name: _name,
            price: _price * 1 wei, // Price in wei
            quantity: _quantity,
            state: State.Created,
            owner: admin
        });
        
        emit ProductCreated(productCount, _name, _price, _quantity, admin);
        productCount++;
    }

    function buyProduct(uint256 _productId, uint256 _quantity) public payable onlyRegisteredUser productExists(_productId) {
        Product storage product = products[_productId];
        require(product.state == State.Created, "Product is not available for sale");
        require(_quantity <= product.quantity, "Not enough quantity available");
        uint256 totalPrice = product.price * _quantity;
        require(msg.value == totalPrice, "Incorrect value sent");
        require(product.owner != msg.sender, "Owner cannot buy their own product");

        product.quantity -= _quantity;

        if (product.quantity == 0) {
            product.owner = msg.sender;
            product.state = State.Sold;
        } else {  
            uint256 newProductId = productCount;
            products[newProductId] = Product({
                name: product.name,
                price: product.price,
                quantity: userProductQuantities[msg.sender][_productId] += _quantity,
                state: State.Created,
                owner: msg.sender
            });
            productCount++;
        }

        emit ProductBought(_productId, msg.sender, _quantity, product.quantity);
    }

    function getProduct(uint256 _productId) public view returns (string memory, uint256, uint256, State, address) {
        Product memory product = products[_productId];
        return (product.name, product.price, product.quantity, product.state, product.owner);
    }

    function getAllProducts() public view returns (ProductWithID[] memory) {
        ProductWithID[] memory allProducts = new ProductWithID[](productCount);
        for (uint256 i = 0; i < productCount; i++) {
            Product storage product = products[i];
            allProducts[i] = ProductWithID({
                productId: i,
                name: product.name,
                price: product.price,
                quantity: product.quantity,
                state: product.state,
                owner: product.owner
            });
        }
        return allProducts;
    }
}
