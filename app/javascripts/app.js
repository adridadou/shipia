var accounts;
var account;
var currentRole;

function initIndex() {
    initCommon('index');
}

function getRoleDescription(role) {
    switch(role) {
        case 1 : return 'Importer';
        case 2 : return 'Exporter';
        case 3 : return 'Shipping company';
        default : return 'Unknown ' + role;
    }
}

function initIssue(){
    var shipia = Shipia.deployed();
    shipia.getBillOwner().then(function(owner){
        shipia.getRole(owner).then(function(role){
            $("#issueOwner").text(getRoleDescription(role.toNumber()));
        });
    });
}

function initCommon() {
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
    var shipia = Shipia.deployed();
    shipia.getRole(web3.eth.defaultAccount).then(function(role) {
       currentRole = role.toNumber();
       switch(currentRole) {
           case 1 : $("#exporterButton").hide();
               shipia.getBuyer().then(function(r) {
                   $("#buyer").val(r);
               });
               shipia.getSeller().then(function(r) {
                   $("#seller").val(r);
               });
               shipia.getPrice().then(function(r) {
                   $("#price").val(r.toNumber());
               });

               shipia.getDescription().then(function(r) {
                   $("#cargo").val(r);
               });
           break;
           case 2 : $("#importerButton").hide();
               $("#seller").val(web3.eth.defaultAccount);
           break;
           default:
               console.log('unknown role id:' + currentRole);
               break;
       }

    });
  });
}

function reset() {
    var shipia = Shipia.deployed();
    shipia.reset({from:web3.eth.defaultAccount}).then(function() {
       console.log('reset!');
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
    shipia.setRole("0xf280d7eAE02D401CC319a73EFF9d1328AAD60A3D".toLowerCase(), 1, {from:web3.eth.defaultAccount}).then(function(){
        shipia.setRole("0x0aA7511BA4FE893a3d2D68F295eB052543Df9E9F".toLowerCase(), 2, {from:web3.eth.defaultAccount}).then(function(){
            shipia.setRole("0x37c6194E43a80F35B7B0A15B6635F9367F00073e".toLowerCase(), 3, {from:web3.eth.defaultAccount});
        });
    });
    console.log('setting roles');
}

function createSale() {
    var shipia = Shipia.deployed();
    var buyer = $("#buyer").val().toLowerCase();
    var seller = $("#seller").val().toLowerCase();
    var price = $("#price").val();
    var description = $("#cargo").val();

    console.log("createSale:", seller, buyer, price, description);
    shipia.initSale(seller, buyer, parseInt(price), description, {from: web3.eth.defaultAccount}).then(function (err,res) {
        console.log(err,res);
        alert('sale created!');
    }).catch(function(err) {
        console.log(err);
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
    shipia.getSeller().then(function(owner) {
        shipia.createBill(owner, {from: web3.eth.defaultAccount}).then(function(){
            window.location.reload();
        });
    });
}

function transferBill() {
    var shipia = Shipia.deployed();
    console.log("transferBill:", shipia);
    shipia.getBuyer().then(function(owner){
        shipia.transferBill(owner, {from: web3.eth.defaultAccount}).then(function(){
            window.location.reload();
        });
    });
}

function withdraw(){
    var shipia = Shipia.deployed();
    shipia.withdraw({from: web3.eth.defaultAccount});
}
