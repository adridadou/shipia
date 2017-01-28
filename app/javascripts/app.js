var accounts;
var account;

window.onload = function() {
  web3.eth.getAccounts(function(err, accs) {
    if (err != null) {
      alert("There was an error fetching your accounts.");
      return;
    }

    if (accs.length == 0) {
      alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
      return;
    }

    accounts = accs;
    account = accounts[0];
  });
};


function createSale() {
  var shipia = Shipia.deployed();
  var buyer = $("#buyer").val();
  var seller = $("#seller").val();
  var price = $("#price").val();
  var description = $("#cargo").val();

  console.log("createSale:", shipia, buyer, seller, price, description);
  shipia.initSale(buyer, seller, price, description);

}
