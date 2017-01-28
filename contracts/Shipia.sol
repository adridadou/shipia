pragma solidity ^0.4.8;

// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!


contract BillContract {

}

contract SaleContract {

    address owner;
    uint price;
    address buyer;
    string description;

    modifier ownerOnly {
        if(msg.sender != owner) throw;
        _;
    }

    function SaleContract() {
        owner = msg.sender;
    }

    function initSale(address _buyer, uint _price, string cargoDescription) ownerOnly {
        buyer = _buyer;
        price = _price;
        description = cargoDescription;
    }

    function getSeller() constant returns (address) {
        return owner;
    }

    function getBuyer() constant returns (address) {
        return buyer;
    }

    function getPrice() constant returns (uint) {
        return price;
    }

    function getDescription() constant returns (string) {
        return description;
    }
}
