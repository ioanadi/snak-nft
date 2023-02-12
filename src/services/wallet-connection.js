import {
    ENVIRONMENTS,
    L1_PROVIDERS,
    WalletSDK,
  } from '@imtbl/wallet-sdk-web';
  
  (async () => {
    // Builds the Wallet SDK object
    const sdk = await WalletSDK.build({
      env: ENVIRONMENTS.STAGING,
      /*
        RPC config is only required if the WalletConnect provider (L1_PROVIDERS.WALLET_CONNECT)
        is being used. Follow this reference for the RPC config:
        https://docs.walletconnect.com/quick-start/dapps/web3-provider#provider-options
      */
      rpc: {
        5: 'https://goerli.mycustomnode.com',
      },
      /*
        Will switch the chain based on this configured chainID when connecting to the wallet.(Optional)
        Following the table below to get the chainID and name mapping. 
        Consult https://chainlist.org/ for more.
        ChainId	| Network
        --- --- | --- --- 
        1	      | Ethereum Main Network (Mainnet)
        5	      | Goerli Test Network
      */
      chainID: 5,
    });
  
    // Connects on the chosen provider - WalletConnect
    const walletConnection = await sdk.connect({ provider: L1_PROVIDERS.WALLET_CONNECT });
    // For Metamask:
    // const walletConnection = await sdk.connect({ provider: L1_PROVIDERS.METAMASK });
  
    // Register the user using the Core SDK
    await coreSdkWorkflows.registerOffchain(walletConnection);
  })();
  