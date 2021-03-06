var accounts;
var account;
var currentRole;
var billOwner;

var exporterName = 'Zhaolin Diapers Ltd. (EXPORTER)';
var importerName = 'Gogola Belgium ltd (IMPORTER)';
var shipperName = 'Rando Shipping (SHIPPER)';

function initIndex() {
    setInterval(initCommon, 500);
}

function getRoleDescription(role) {
    switch(role) {
        case 1 : return importerName;
        case 2 : return exporterName;
        case 3 : return shipperName;
        default : return '-';
    }
}

function initIssue(){
    web3.eth.getAccounts(function() {
        var shipia = Shipia.deployed();
        setInterval(function() {
            shipia.getContractStatus().then(function(status) {
                shipia.getRole(web3.eth.defaultAccount).then(function(role) {
                    currentRole = role.toNumber();
                    $("#issueLogin").text(getRoleDescription(currentRole));
                    if(currentRole === 3 && status.toNumber() === 3) {
                        $("#issueButton").show();
                    }else {
                        $("#issueButton").hide();
                    }

                });
            });

            shipia.getBillOwner().then(function(owner){
                billOwner = owner;
                shipia.getRole(owner).then(function(role){
                    $("#issueOwner").text(getRoleDescription(role.toNumber()));
                });
            });

        }, 1000);
    });
}

function initTransfer(){
    web3.eth.getAccounts(function() {
        var shipia = Shipia.deployed();

        setInterval(function() {
            shipia.getRole(web3.eth.defaultAccount).then(function(role) {
                currentRole = role.toNumber();
                $("#transferLogin").text(getRoleDescription(currentRole));
            });

            shipia.getBillOwner().then(function(owner){
                if(owner === web3.eth.defaultAccount) {
                    $("#transferButton").show();
                }else {
                    $("#transferButton").hide();
                }

                shipia.getRole(owner).then(function(role){
                    $("#transferOwner").text(getRoleDescription(role.toNumber()));
                });
            });
        }, 1000);
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

      setInterval(function() {
          shipia.getRole(web3.eth.defaultAccount).then(function(role) {
              currentRole = role.toNumber();
              $("#indexLogin").text(getRoleDescription(currentRole));
          });
      }, 1000);

    accounts = accs;
    account = accounts[0];
    var shipia = Shipia.deployed();
    shipia.getRole(web3.eth.defaultAccount).then(function(role) {
       currentRole = role.toNumber();
       $("#indexLogin").text(getRoleDescription(currentRole));

        shipia.getContractStatus().then(function(status) {
            switch(status.toNumber()) {
                case 1: //Draft
                    if(currentRole !== 2) {
                        shipia.getSeller().then(function(r) {
                            $("#seller").val(r);
                        });
                        shipia.getBuyer().then(function(r) {
                            $("#buyer").val(r);
                        });
                        shipia.getPrice().then(function(r) {
                            $("#price").val(r.toNumber());
                        });
                        shipia.getDescription().then(function(r) {
                            $("#cargo").val(r);
                        });
                    }else {
                        $("#seller").val(web3.eth.defaultAccount);
                    }
                    $("#buyer").prop('disabled', currentRole !== 2);
                    $("#seller").prop('disabled', currentRole !== 2);
                    $("#price").prop('disabled', currentRole !== 2);
                    $("#cargo").prop('disabled', currentRole !== 2);
                    if(currentRole === 2) {
                        $("#exporterButton").show();
                    }else {
                        $("#exporterButton").hide();
                    }

                    $("#importerButton").hide();
                    break;
                case 2: //Initialized
                    shipia.getSeller().then(function(r) {
                        $("#seller").val(r);
                    });
                    shipia.getBuyer().then(function(r) {
                        $("#buyer").val(r);
                    });
                    shipia.getPrice().then(function(r) {
                        $("#price").val(r.toNumber());
                    });
                    shipia.getDescription().then(function(r) {
                        $("#cargo").val(r);
                    });
                    $("#buyer").prop('disabled', true);
                    $("#seller").prop('disabled', true);
                    $("#price").prop('disabled', true);
                    $("#cargo").prop('disabled', true);
                    $("#exporterButton").hide();
                    if(currentRole === 1) {
                        $("#importerButton").show();
                    }else {
                        $("#importerButton").hide();
                    }

                    break;
                default: //Rest of status
                    shipia.getSeller().then(function(r) {
                        $("#seller").val(r);
                    });
                    shipia.getBuyer().then(function(r) {
                        $("#buyer").val(r);
                    });
                    shipia.getPrice().then(function(r) {
                        $("#price").val(r.toNumber());
                    });
                    shipia.getDescription().then(function(r) {
                        $("#cargo").val(r);
                    });
                    $("#buyer").prop('disabled', true);
                    $("#seller").prop('disabled', true);
                    $("#price").prop('disabled', true);
                    $("#cargo").prop('disabled', true);
                    $("#exporterButton").hide();
                    $("#importerButton").hide();
                    break;
            }
        });
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
  var price = $("#price").val();
  console.log("acceptSale:", price);
  shipia.acceptSale({from:web3.eth.defaultAccount, value:parseInt(price)}).then(function() {
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
        });
    });
}

function transferBill() {
    var shipia = Shipia.deployed();
    console.log("transferBill:", shipia);
    shipia.getBuyer().then(function(owner){
        shipia.transferBill(owner, {from: web3.eth.defaultAccount}).then(function(){
            shipia.withdraw({from: web3.eth.defaultAccount}).then(function() {
                alert('money transfered!');
            })
        });
    });
}

function withdraw(){
    var shipia = Shipia.deployed();
    shipia.withdraw({from: web3.eth.defaultAccount});
}
