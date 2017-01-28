package org.shipia;

import com.google.common.collect.Lists;
import org.adridadou.ethereum.EthereumFacade;
import org.adridadou.ethereum.provider.InfuraRopstenEthereumFacadeProvider;
import org.adridadou.ethereum.values.*;
import org.adridadou.ethereum.values.config.InfuraKey;
import org.junit.Before;
import org.junit.Test;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

import static org.adridadou.ethereum.keystore.AccountProvider.from;
import static org.adridadou.ethereum.values.EthValue.ether;
import static org.adridadou.ethereum.values.EthValue.wei;
import static org.junit.Assert.assertEquals;

/**
 * Created by davidroon on 28.01.17.
 */
public class BootstrapProject {
    public static final EthValue PRICE = ether(100);
    private static final EthValue USED_GAS = wei(1_714_050_000_000_000L);
    private final EthAccount mainAccount = from("mainAccount");
    private final EthAccount buyerAccount = from("buyerAccount");
    private final EthAccount sellerAccount = from("sellerAccount");
    private final EthAccount shippingAccount = from("shippingAccount");
    private final List<EthAccount> accounts = Lists.newArrayList(mainAccount,buyerAccount,sellerAccount, shippingAccount);
    private EthereumFacade ethereum;
    private CompiledContract saleContract;
    private EthAddress saleContractAddress;
    private final Map<EthAccount, SaleContract> contracts = new HashMap<>();

    @Before
    public void before() throws ExecutionException, InterruptedException {
        ethereum = InfuraRopstenEthereumFacadeProvider.create(InfuraKey.of("57yGdS5iZEfm7G4MpJAo"));

        System.out.println("main account:" + ethereum.getBalance(mainAccount.getAddress()));
        System.out.println("buyer account:" + ethereum.getBalance(buyerAccount.getAddress()));
        System.out.println("seller account:" + ethereum.getBalance(sellerAccount.getAddress()));

        saleContract = ethereum.compile(SoliditySource.from(new File("contracts/Shipia.sol")), "Shipia").get();
        saleContractAddress = ethereum.publishContract(saleContract, mainAccount).get();
        accounts.forEach(account -> contracts.put(account, ethereum.createContractProxy(saleContract, saleContractAddress, account, SaleContract.class)));
    }

    @Test
    public void billLifecycle() throws ExecutionException, InterruptedException {
        initRoles();
    }

    private void initRoles() throws InterruptedException, ExecutionException {
        contracts.get(mainAccount).setOwner(mainAccount).get();
        assertEquals(mainAccount.getAddress(), contracts.get(mainAccount).getOwner());
        contracts.get(mainAccount).setRole(buyerAccount, UserRole.Buyer).get();
        contracts.get(mainAccount).setRole(sellerAccount, UserRole.Seller).get();
        contracts.get(mainAccount).setRole(shippingAccount, UserRole.Shipping).get();
    }

    public interface SaleContract {
        CompletableFuture<Void> initSale(EthAccount seller, EthAccount buyer, EthValue price, String cargoDescription);
        CompletableFuture<Void> setRole(EthAccount account, UserRole role);
        UserRole getRole(EthAccount account);
        ContractStatus getContractStatus();
        EthValue getPrice();
        Payable<Void> acceptSale();
        CompletableFuture<Void> createBill(EthAccount seller);
        EthAddress getBillOwner();
        CompletableFuture<Void> transferBill(EthAccount buyerAccount);
        CompletableFuture<Void> withdraw();
        EthAddress getOwner();

        CompletableFuture<Void> setOwner(EthAccount mainAccount);
    }

    public enum UserRole {
        Unknown, Buyer, Seller, Shipping
    }

    public enum ContractStatus {Unknown, Draft, Initialized, Accepted, Shipped, Done}
}
