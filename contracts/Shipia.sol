pragma solidity ^0.4.8;

// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!


contract BillContract {

}

contract SaleContract {

    address owner;
    ContractStatus status;
    uint price;
    string description;
    address billOwner;
    mapping(address => UserRole) roles;

    enum UserRole {Unknown, Buyer, Seller, Shipping}
    enum ContractStatus {Unknown, Initialized, Accepted,Shipped, Done}

    modifier ownerOnly {
        if(msg.sender != owner) throw;
        _;
    }

    modifier roleOnly(address addr, UserRole role) {
        if(roles[addr] != role) throw;
        _;
    }

    function SaleContract() {
        owner = msg.sender;
    }

    function initSale(uint _price, string cargoDescription) roleOnly(msg.sender, UserRole.Seller) {
        price = _price;
        description = cargoDescription;
        status = ContractStatus.Initialized;
    }

    function acceptSale() payable roleOnly(msg.sender, UserRole.Buyer) {
        if(msg.value < price) throw;
        if(msg.value > price) {
            if(!msg.sender.send(msg.value - price)){
                throw;
            }
        }
        status = ContractStatus.Accepted;
    }

    function createBill(address billOwner) roleOnly(msg.sender, UserRole.Shipping) roleOnly(billOwner, UserRole.Seller) {
        billOwner = billOwner;
        status = ContractStatus.Shipped;
    }

    function getPrice() constant returns (uint) {
        return price;
    }

    function getDescription() constant returns (string) {
        return description;
    }

    function setRole(address user, UserRole role) ownerOnly{
        roles[user] = role;
    }

    function getRole(address user) constant returns (UserRole) {
        return roles[user];
    }

    function getContractStatus() constant returns(ContractStatus) {
        return status;
    }

    function getBillOwner() constant returns (address) {
        return billOwner;
    }
}
