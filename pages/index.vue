<template>
  <div>
    <Header />

    <hr :style="{ margin: '2rem' }" />

    <div
      :style="{
        display: 'grid',
        gridGap: '1rem',
        gridTemplateColumns: '1fr 1fr',
        maxWidth: '20rem',
        margin: 'auto'
      }"
    >
      <button
        v-for="(newConnector, name) in connectorsByName"
        class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        :key="name"
        @click="activate(newConnector)"
      >
        <span
          class="mr-2 "
          v-if="newConnector === connector"
          role="img"
          aria-label="check"
        >
          ✅
        </span>
        {{ name }}
      </button>
    </div>

    <div
      class="flex flex-col items-center mt-4"
    >
      <button
        v-if="active || error"
        class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        @click="deactivate"
      >
        Deactivate
      </button>

      <h4 v-if="!!error" :style="{ marginTop: '1rem', marginBottom: '0' }">
        {{ getErrorMessage(error) }}
      </h4>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import {
  useWeb3,
  setWeb3LibraryCallback,
  UnsupportedChainIdError
} from "@kabbouchi/vue-web3";
import {
  injected,
  network,
  walletconnect,
  ledger,
  authereum
} from "~/connectors";
import { useEagerConnect } from "~/composables";
import { Web3Provider } from "@ethersproject/providers";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected
} from "@web3-react/injected-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from "@web3-react/walletconnect-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorFrame } from "@web3-react/frame-connector";

enum ConnectorNames {
  Injected = "Injected",
  Network = "Network",
  WalletConnect = "WalletConnect",
  // WalletLink = "WalletLink",
  Ledger = "Ledger",
  // Trezor = "Trezor",
  // Lattice = "Lattice",
  // Frame = "Frame",
  Authereum = "Authereum"
  // Fortmatic = "Fortmatic",
  // Magic = "Magic",
  // Portis = "Portis",
  // Torus = "Torus"
}

const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.Network]: network,
  [ConnectorNames.WalletConnect]: walletconnect,
  // [ConnectorNames.WalletLink]: walletlink,
  [ConnectorNames.Ledger]: ledger,
  // [ConnectorNames.Trezor]: trezor,
  // [ConnectorNames.Lattice]: lattice,
  // [ConnectorNames.Frame]: frame,
  [ConnectorNames.Authereum]: authereum
  // [ConnectorNames.Fortmatic]: fortmatic,
  // [ConnectorNames.Magic]: magic,
  // [ConnectorNames.Portis]: portis,
  // [ConnectorNames.Torus]: torus
};

function getErrorMessage(error: Error) {
  if (error instanceof NoEthereumProviderError) {
    return "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.";
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network.";
  } else if (
    error instanceof UserRejectedRequestErrorInjected ||
    error instanceof UserRejectedRequestErrorWalletConnect ||
    error instanceof UserRejectedRequestErrorFrame
  ) {
    return "Please authorize this website to access your Ethereum account.";
  } else {
    console.error(error);
    return "An unknown error occurred. Check the console for more details.";
  }
}

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

setWeb3LibraryCallback(getLibrary);

export default defineComponent({
  setup() {
    const { active, activate, deactivate, connector, error } = useWeb3();
    useEagerConnect();

    return {
      active,
      activate,
      deactivate,
      connectorsByName,
      connector,
      getErrorMessage,
      error
    };
  }
});
</script>