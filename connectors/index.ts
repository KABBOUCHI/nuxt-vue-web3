import { InjectedConnector } from "@web3-react/injected-connector";
import { NetworkConnector } from "@web3-react/network-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { LedgerConnector } from '@web3-react/ledger-connector'
import { AuthereumConnector } from '@web3-react/authereum-connector'
import { Web3Provider } from "@ethersproject/providers";
import { setWeb3LibraryCallback } from "@instadapp/vue-web3";

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

setWeb3LibraryCallback(getLibrary);

const POLLING_INTERVAL = 12000;

const RPC_URLS: { [chainId: number]: string } = {
  1: "https://rpc.ankr.com/eth",
  137: "https://rpc.ankr.com/polygon",
};

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 56, 137]
});

export const walletconnect = new WalletConnectConnector({
  rpc: { 1: RPC_URLS[1] },
  qrcode: true
});

export const network = new NetworkConnector({
  urls: { 1: RPC_URLS[1] },
  defaultChainId: 1
});


export const ledger = new LedgerConnector({ chainId: 1, url: RPC_URLS[1], pollingInterval: POLLING_INTERVAL })

export const authereum = new AuthereumConnector({ chainId: 1 })
