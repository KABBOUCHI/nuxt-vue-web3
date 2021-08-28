import { InjectedConnector } from "@web3-react/injected-connector";
import { NetworkConnector } from "@web3-react/network-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { LedgerConnector } from '@web3-react/ledger-connector'
import { AuthereumConnector } from '@web3-react/authereum-connector'

const POLLING_INTERVAL = 12000;

const RPC_URLS: { [chainId: number]: string } = {
  1: process.env.RPC_URL_1 as string,
  137: "https://rpc-mainnet.matic.network"
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
