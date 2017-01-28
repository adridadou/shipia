package org.shipia;

import org.adridadou.ethereum.EthereumFacade;
import org.adridadou.ethereum.blockchain.TestConfig;
import org.adridadou.ethereum.provider.EthereumFacadeProvider;
import org.adridadou.ethereum.values.CompiledContract;
import org.adridadou.ethereum.values.EthAccount;
import org.adridadou.ethereum.values.EthAddress;
import org.adridadou.ethereum.values.SoliditySource;
import org.junit.Before;
import org.junit.Test;

import java.io.File;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

import static org.adridadou.ethereum.keystore.AccountProvider.from;
import static org.adridadou.ethereum.values.EthValue.ether;

/**
 * Created by davidroon on 28.01.17.
 */
public class BillContractTest {
    private final EthAccount mainAccount = from("mainAccount");
    private EthereumFacade ethereum;
    private CompletableFuture<CompiledContract> billContract;

    @Before
    public void before() {
        ethereum = EthereumFacadeProvider.forTest(TestConfig.builder()
                .balance(mainAccount, ether(1000000000))
                .build());

        billContract = ethereum.compile(SoliditySource.from(new File("contracts/Shipia.sol")), "BillContract");
    }

    @Test
    public void billLifecycle() throws ExecutionException, InterruptedException {
        CompletableFuture<EthAddress> billContractAddress = ethereum.publishContract(billContract.get(), mainAccount);

    }

    public interface BillContract {
        CompletableFuture<Void> createBill();
    }
}
