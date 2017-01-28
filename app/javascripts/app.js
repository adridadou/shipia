var account;
var currentRole;
var shipia;
var newWeb3;

function initSeller() {
    initCommon('seller');
}

function initBuyer() {
    initCommon('buyer');
    var shipia = Shipia.deployed();
    $.when(shipia.getPrice(), shipia.getContractStatus()).then(function(price,status) {
       console.log(price.toNumber(),status.toNumber());
    });
}

function initIndex() {
    initCommon('index');
}

function initCommon(status) {

    var walletBar = new WalletBar({
        dappNamespace: 'shipia',
        blockchain: "norsborg",
        callbacks: { signOut: function () { location.reload(); } }
    });

    newWeb3 = new Web3();
    walletBar.applyHook(newWeb3)
        .then(function() {
            shipia = newWeb3.eth.contract(Shipia.abi).at(Shipia.address);
            shipia.getRole(account, function(role) {
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
        })
        .catch(function(err) {
            console.log(err);
        });
}

function fullReport() {
    var shipia = Shipia.deployed();
    shipia.getContractStatus().then(function(r) {
        console.log('contract status:' + r.toNumber());
    });

    shipia.getDescription().then(function(r) {
        console.log('description:' + r);
    })
}

function setOwner() {
    var shipia = Shipia.deployed();
    shipia.getOwner().then(function(r) {
        console.log('owner:' + r);
    });
    shipia.setOwner(web3.eth.defaultAccount, {from:web3.eth.defaultAccount}).then(function(){
        console.log('set owner done');
        shipia.getOwner().then(function(r) {
            console.log('owner:' + r);
        });
    });
}

function setRoles() {
    var shipia = Shipia.deployed();
    shipia.setRole("0xf280d7eAE02D401CC319a73EFF9d1328AAD60A3D".toLowerCase(), 1, {from:web3.eth.defaultAccount});
    shipia.setRole("0x0aA7511BA4FE893a3d2D68F295eB052543Df9E9F".toLowerCase(), 2, {from:web3.eth.defaultAccount});
    shipia.setRole("0x37c6194E43a80F35B7B0A15B6635F9367F00073e".toLowerCase(), 3, {from:web3.eth.defaultAccount});
    console.log('setting roles');
}

function reset() {
    var shipia = Shipia.deployed();
    shipia.reset({from:web3.eth.defaultAccount});

}

function createSale() {
    //var shipia = web3.eth.contract(Shipia.abi).at(Shipia.address);
    var buyer = $("#buyer").val().toLowerCase();
    var seller = $("#seller").val().toLowerCase();
    var price = $("#price").val();
    var description = $("#cargo").val();

    console.log("createSale:", seller, buyer, price, description);
    shipia.initSale(seller, buyer, parseInt(price), description, {from: walletBar.getCurrentAccount()}, function(err,res){
        console.log(err,res);
    });
}

function acceptSale() {
  var shipia = Shipia.deployed();
  var buyer = $("#buyer").val().toLowerCase();
  var seller = $("#seller").val().toLowerCase();
  var price = $("#price").val();
  var description = $("#cargo").val();

  console.log("acceptSale:", shipia, buyer, seller, price, description);
  var promise = shipia.acceptSale({from:walletBar.getCurrentAccount()}).then(function() {
      alert('sale accepted!');
  }).catch(function(err){
      console.log('error:', err);
  });

  console.log(promise);
}
