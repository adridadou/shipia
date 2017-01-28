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

function init() {
    var shipia = Shipia.deployed();
    shipia.reset({from:web3.eth.defaultAccount}).then(function() {
        shipia.setOwner(web3.eth.defaultAccount, {from:web3.eth.defaultAccount}).then(function() {
            shipia.setRole("0xf280d7eAE02D401CC319a73EFF9d1328AAD60A3D".toLowerCase(), 1, {from:web3.eth.defaultAccount});
            shipia.setRole("0x0aA7511BA4FE893a3d2D68F295eB052543Df9E9F".toLowerCase(), 2, {from:web3.eth.defaultAccount});
            shipia.setRole("0x37c6194E43a80F35B7B0A15B6635F9367F00073e".toLowerCase(), 3, {from:web3.eth.defaultAccount});
            console.log('setting roles');
        });
    });

}

function createSale() {
  var shipia = Shipia.deployed();
  var buyer = $("#buyer").val().toLowerCase();
  var seller = $("#seller").val().toLowerCase();
  var price = $("#price").val();
  var description = $("#cargo").val();

  console.log("createSale:", shipia, buyer, seller, price, description);
  shipia.initSale(buyer, seller, price, description, {from:web3.eth.defaultAccount}).then(function() {
      alert('sale created!');
  });
}
