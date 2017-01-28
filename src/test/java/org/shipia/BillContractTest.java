package org.shipia;

import org.adridadou.ethereum.EthereumFacade;
import org.adridadou.ethereum.blockchain.TestConfig;
import org.adridadou.ethereum.provider.EthereumFacadeProvider;
import org.adridadou.ethereum.values.EthAccount;
import org.junit.Test;

import static org.adridadou.ethereum.keystore.AccountProvider.from;
import static org.adridadou.ethereum.values.EthValue.ether;

/**
 * Created by davidroon on 28.01.17.
 */
public class BillContractTest {
    private final EthAccount mainAccount = from("mainAccount");
    private final EthAccount insuranceAccountA = from("insuranceAccountA");
    private final EthAccount insuranceAccountB = from("insuranceAccountB");
    private final EthAccount retailerAccount = from("retailerAccount");
    private EthereumFacade ethereum;

    @Test
    public void before() {
        ethereum = EthereumFacadeProvider.forTest(TestConfig.builder()
                .balance(mainAccount, ether(1000000000))
                .balance(insuranceAccountA, ether(1000000000))
                .balance(insuranceAccountB, ether(1000000000))
                .balance(retailerAccount, ether(1000000000))
                .build());
    }

    @Test
    public void billLifecycle() {

    }
}
