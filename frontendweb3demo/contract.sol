// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract SupplyChain {
    address public admin;

    enum State { Created, InTransit, Delivered, Sold }
    enum UserType { User, Store, Provider }

    struct Product {
        string name;
        uint256 price;
        uint256 quantity;
        State state;
        address owner;
        address previousOwner; 
    }

    struct User {
        address userAddress;
        string username;
        bool isRegistered;
        UserType userType;
    }

    struct ProductWithID {
        uint256 productId;
        string name;
        uint256 price;
        uint256 quantity;
        State state;
        address owner;
        address previousOwner; 
    }

    mapping(uint256 => Product) public products;
    mapping(address => User) private users;
    mapping(address => mapping(uint256 => uint256)) public userProductQuantities;

    uint256 public productCount;

    event ProductCreated(uint256 productId, string name, uint256 price, uint256 quantity, address owner);
    event ProductBought(uint256 productId, address newOwner, uint256 quantity, uint256 remainingQuantity, uint256 newPrice);
    event UserRegistered(address userAddress, string username, UserType userType);
    event ProductUpdated(uint256 productId, uint256 newPrice);
    event ProductBought(uint256 productId, address newOwner, uint256 quantity, uint256 remainingQuantity);



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
            isRegistered: true,
            userType: UserType.Provider 
        });
        emit UserRegistered(admin, "Admin", UserType.Provider);
    }

    function registerUser(string memory _username, UserType _userType) public {
        require(!users[msg.sender].isRegistered, "User already registered");
        users[msg.sender] = User({
            userAddress: msg.sender,
            username: _username,
            isRegistered: true,
            userType: _userType
        });
        emit UserRegistered(msg.sender, _username, _userType);
    }

    function isUserRegistered(address userAddress) public view returns (bool) {
        return users[userAddress].isRegistered;
    }

    function createProduct(string memory _name, uint256 _price, uint256 _quantity) public onlyRegisteredUser {
        require(users[msg.sender].userType == UserType.Provider, "Only providers can create products");
        products[productCount] = Product({
            name: _name,
            price: _price * 1 wei, // Price in wei
            quantity: _quantity,
            state: State.Created,
            owner: msg.sender,
            previousOwner: address(0) 
        });

        emit ProductCreated(productCount, _name, _price, _quantity, msg.sender);
        productCount++;
    }

    function buyProduct(uint256 _productId, uint256 _quantity, uint256 _newPrice) public payable onlyRegisteredUser productExists(_productId) {
        Product storage product = products[_productId];
        require(product.state == State.Created, "Product is not available for sale");
        require(_quantity <= product.quantity, "Not enough quantity available");
        
        require(msg.sender != product.owner, "Owner cannot buy their own product");

        if (users[msg.sender].userType == UserType.User && users[product.owner].userType == UserType.Store) {
            require(msg.value == _newPrice * _quantity, "Incorrect amount of ether sent for the new price");

            product.quantity -= _quantity;
            userProductQuantities[msg.sender][_productId] += _quantity; 

            if (product.quantity == 0) {
                product.state = State.Sold;
            }

            product.previousOwner = product.owner; 
            product.owner = msg.sender;

            payable(product.previousOwner).transfer(msg.value);

            emit ProductBought(_productId, msg.sender, _quantity, product.quantity, _newPrice);
        } else if (users[msg.sender].userType == UserType.Store && users[product.owner].userType == UserType.Provider) {
            require(msg.value == product.price * _quantity, "Incorrect value sent");

            product.quantity -= _quantity;
            if (product.quantity == 0) {
                product.state = State.Sold;
            }

            products[productCount++] = Product({
                name: product.name,
                price: _newPrice, 
                quantity: _quantity,
                state: State.Delivered,
                owner: msg.sender,
                previousOwner: product.owner 
            });


            emit ProductBought(_productId, msg.sender, _quantity, product.quantity, _newPrice);
        } else {
            revert("Unauthorized transaction type");
        }
    }

    function updateProductPrice(uint256 _productId, uint256 _newPrice) public onlyRegisteredUser productExists(_productId) {
        Product storage product = products[_productId];
        require(msg.sender == product.owner, "Only the product owner can update the price");
        require(_newPrice > 0, "Price must be positive");

        product.price = _newPrice;
        emit ProductUpdated(_productId, _newPrice);
    }

    function getProduct(uint256 _productId) public view returns (string memory, uint256, uint256, State, address, address) {
        Product memory product = products[_productId];
        return (product.name, product.price, product.quantity, product.state, product.owner, product.previousOwner);
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
                owner: product.owner,
                previousOwner: product.previousOwner 
            });
        }
        return allProducts;
    }

    function getStoreProducts(address storeAddress) public view returns (ProductWithID[] memory) {
        require(users[storeAddress].isRegistered, "Store is not registered.");
        require(users[storeAddress].userType == UserType.Store, "Address does not belong to a store.");

        uint256 count = 0;
        for (uint256 i = 0; i < productCount; i++) {
            if (products[i].owner == storeAddress) {
                count++;
            }
        }

        ProductWithID[] memory storeProducts = new ProductWithID[](count);

        uint256 index = 0;
        for (uint256 i = 0; i < productCount; i++) {
            if (products[i].owner == storeAddress) {
                storeProducts[index] = ProductWithID({
                    productId: i,
                    name: products[i].name,
                    price: products[i].price,
                    quantity: products[i].quantity,
                    state: products[i].state,
                    owner: products[i].owner,
                    previousOwner: products[i].previousOwner 
                });
                index++;
            }
        }

        return storeProducts;
    }

   function buyProductFromStore(uint256 _productId, uint256 _quantity) public payable onlyRegisteredUser productExists(_productId) {
    Product storage product = products[_productId];
    require(_quantity <= product.quantity, "Not enough quantity available");
    require(msg.sender != product.owner, "Owner cannot buy their own product");
    require(users[msg.sender].userType == UserType.User || users[msg.sender].userType == UserType.Store, "Invalid user type for purchase");
    require(msg.value == product.price * _quantity, "Incorrect value sent");

    product.quantity -= _quantity;
    userProductQuantities[msg.sender][_productId] += _quantity;

    products[productCount++] = Product({
        name: product.name,
        price: product.price,
        quantity: _quantity,
        state: State.Delivered,
        owner: msg.sender,
        previousOwner: product.owner
    });

    payable(product.owner).transfer(msg.value);

    if (product.quantity == 0) {
        product.state = State.Sold;
        product.previousOwner = product.owner;  
        product.owner = msg.sender;
    }

    emit ProductBought(_productId, msg.sender, _quantity, product.quantity, product.price);
}


  function getUserType(address userAddress) public view returns (UserType) {
        require(users[userAddress].isRegistered, "User is not registered");
        return users[userAddress].userType;
    }

}
