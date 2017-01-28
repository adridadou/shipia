var accounts;
var account;
var currentRole;

function initSeller() {
    initCommon('seller');
    $("#seller").val(web3.eth.defaultAccount);
}

function initBuyer() {
    initCommon('buyer');
    var shipia = Shipia.deployed();
    shipia.getPrice().then(function(r) {
        $("#price").val(r.toNumber());
    });

    shipia.getDescription().then(function(r) {
        $("#cargo").val(r);
    })
}

function initIndex() {
    initCommon('index');
}

function initCommon(status) {
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

    Shipia.deployed().getRole(account).then(function(role) {
       currentRole = role.toNumber();
       switch(currentRole) {
           case 1 : if(status !== 'buyer') {
               window.location = 'buyer.html';
           }
           break;
           case 2 : if(status !== 'seller') {
               window.location = 'seller.html';
           }
           break;
           default:
               alert('unknown role id:' + currentRole);
               break;
       }
    });
  });
}

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
    shipia.initSale(buyer, seller, price, description, {from: web3.eth.defaultAccount}).then(function () {
        alert('sale created!');
    });
}

function acceptSale() {
  var shipia = Shipia.deployed();
  var buyer = $("#buyer").val().toLowerCase();
  var seller = $("#seller").val().toLowerCase();
  var price = $("#price").val();
  var description = $("#cargo").val();

  console.log("acceptSale:", shipia, buyer, seller, price, description);
  shipia.acceptSale({from:web3.eth.defaultAccount}).then(function() {
      alert('sale accepted!');
  });
}

function fullReport() {
    var shipia = Shipia.deployed();
    shipia.getContractStatus().then(function(r) {
        console.log('contract status:' + r.toNumber());
    });

    shipia.getDescription().then(function(r) {
        console.log('description:' + r);
    });

    shipia.getPrice().then(function(r) {
        console.log('price:' + r.toNumber());
    })
}

function createBill() {
  var shipia = Shipia.deployed();
  console.log("createBill:", shipia);
  shipia.createBill(shipia.getBillOwner(), {from:web3.eth.defaultAccount});
  shipia.setOwner(shipia.getSeller(), {from:web3.eth.defaultAccount}).then(function() {
  $("#issueOwner").text("Exporter");
  }); 


function transferBill() {
  var shipia = Shipia.deployed();
  console.log("transferBill:", shipia);
  shipia.transferBilll(shipia.getBillOwner(), {from:web3.eth.defaultAccount}); 
  shipia.withdraw({from:web3.eth.defaultAccount});   
  shipia.setOwner(shipia.getBuyer(), {from:web3.eth.defaultAccount}).then(function() { 
  $("#transferOwner").text("Importer");
  }); 
