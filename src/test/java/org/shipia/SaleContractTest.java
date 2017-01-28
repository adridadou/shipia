package org.shipia;

import org.adridadou.ethereum.EthereumFacade;
import org.adridadou.ethereum.blockchain.TestConfig;
import org.adridadou.ethereum.provider.EthereumFacadeProvider;
import org.adridadou.ethereum.values.*;
import org.junit.Before;
import org.junit.Test;

import java.io.File;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

import static org.adridadou.ethereum.keystore.AccountProvider.from;
import static org.adridadou.ethereum.values.EthValue.ether;
import static org.junit.Assert.assertEquals;

/**
 * Created by davidroon on 28.01.17.
 */
public class SaleContractTest {
    private final EthAccount mainAccount = from("mainAccount");
    private final EthAccount buyerAccount = from("buyerAccount");
    private final EthAccount sellerAccount = from("sellerAccount");
    private EthereumFacade ethereum;
    private CompiledContract saleContract;

    @Before
    public void before() throws ExecutionException, InterruptedException {
        ethereum = EthereumFacadeProvider.forTest(TestConfig.builder()
                .balance(mainAccount, ether(1000000000))
                .balance(buyerAccount, ether(1000000000))
                .balance(sellerAccount, ether(1000000000))
                .build());

        saleContract = ethereum.compile(SoliditySource.from(new File("contracts/Shipia.sol")), "SaleContract").get();
    }

    @Test
    public void billLifecycle() throws ExecutionException, InterruptedException {
        EthAddress saleContractAddress = ethereum.publishContract(saleContract, sellerAccount).get();
        SaleContract saleForSeller = ethereum.createContractProxy(saleContract, saleContractAddress,sellerAccount, SaleContract.class);
        SaleContract saleForBuyer = ethereum.createContractProxy(saleContract, saleContractAddress,buyerAccount, SaleContract.class);

        saleForSeller.initSale(buyerAccount, ether(100), "50,000,000 roses").get();
        assertEquals(sellerAccount.getAddress(), saleForSeller.getSeller());
        assertEquals(buyerAccount.getAddress(), saleForSeller.getBuyer());
        assertEquals(ether(100), saleForSeller.getPrice());


    }

    public interface SaleContract {
        CompletableFuture<Void> initSale(EthAccount buyer, EthValue price, String cargoDescription);

        EthAddress getSeller();

        EthAddress getBuyer();

        EthValue getPrice();
    }
}
