package org.shipia;

import com.google.common.collect.Lists;
import org.adridadou.ethereum.EthereumFacade;
import org.adridadou.ethereum.blockchain.TestConfig;
import org.adridadou.ethereum.provider.EthereumFacadeProvider;
import org.adridadou.ethereum.values.*;
import org.adridadou.exception.EthereumApiException;
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
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;

/**
 * Created by davidroon on 28.01.17.
 */
public class SaleContractTest {
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
        ethereum = EthereumFacadeProvider.forTest(TestConfig.builder()
                .balance(mainAccount, ether(1000000000))
                .balance(buyerAccount, ether(1000000000))
                .balance(sellerAccount, ether(1000000000))
                .balance(shippingAccount, ether(1000000000))
                .build());

        saleContract = ethereum.compile(SoliditySource.from(new File("contracts/Shipia.sol")), "SaleContract").get();
        saleContractAddress = ethereum.publishContract(saleContract, mainAccount).get();
        ethereum.createContractProxy(saleContract, saleContractAddress,sellerAccount, SaleContract.class);
        accounts.forEach(account -> contracts.put(account, ethereum.createContractProxy(saleContract, saleContractAddress,account, SaleContract.class)));
    }

    @Test
    public void billLifecycle() throws ExecutionException, InterruptedException {
        initRoles();
        assertEquals(ContractStatus.Unknown, contracts.get(mainAccount).getContractStatus());
        initSale();
        assertEquals(ContractStatus.Initialized, contracts.get(mainAccount).getContractStatus());
        try {
            contracts.get(buyerAccount).acceptSale().with(ether(50)).get();
            fail("it should throw because not enough money is being sent");
        }catch(ExecutionException e) {
            assertEquals(EthereumApiException.class, e.getCause().getClass());
        }

        contracts.get(buyerAccount).acceptSale().with(ether(150)).get();
        assertEquals(contracts.get(mainAccount).getPrice(), ethereum.getBalance(saleContractAddress));

    }

    private void initSale() throws InterruptedException, ExecutionException {
        contracts.get(sellerAccount).initSale(ether(100), "50,000,000 roses").get();
        assertEquals(UserRole.Seller, contracts.get(sellerAccount).getRole(sellerAccount));
        assertEquals(UserRole.Buyer, contracts.get(sellerAccount).getRole(buyerAccount));
        assertEquals(UserRole.Shipping, contracts.get(sellerAccount).getRole(shippingAccount));
        assertEquals(ether(100), contracts.get(sellerAccount).getPrice());
    }

    private void initRoles() throws InterruptedException, ExecutionException {
        contracts.get(mainAccount).setRole(buyerAccount, UserRole.Buyer).get();
        contracts.get(mainAccount).setRole(sellerAccount, UserRole.Seller).get();
        contracts.get(mainAccount).setRole(shippingAccount, UserRole.Shipping).get();
    }

    public interface SaleContract {
        CompletableFuture<Void> initSale(EthValue price, String cargoDescription);
        CompletableFuture<Void> setRole(EthAccount account, UserRole role);
        UserRole getRole(EthAccount account);
        ContractStatus getContractStatus();
        EthValue getPrice();
        Payable<Void> acceptSale();
    }

    public enum UserRole {
        Unknown, Buyer, Seller, Shipping
    }

    public enum ContractStatus {Unknown, Initialized, Accepted, Done}
}
