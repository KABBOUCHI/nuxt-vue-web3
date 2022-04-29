<template>
  <Fragment>
    <span class="font-medium">Balance</span>
    <span role="img" aria-label="gold">
      💰
    </span>
    <span>{{
      balance === null ? "Error" : balance ? `Ξ${formatEther(balance)}` : ""
    }}</span>
  </Fragment>
</template>

<script lang="ts">
import { useWeb3 } from "@instadapp/vue-web3";
import { defineComponent, ref, watch } from "@nuxtjs/composition-api";
import { formatEther } from "@ethersproject/units";
import { Web3Provider } from "@ethersproject/providers";

export default defineComponent({
  setup() {
    const { account, library, chainId } = useWeb3<Web3Provider>();
    const balance = ref<number | null>();

    watch([account, library, chainId], () => {
      if (!!library.value && !!account.value) {
        library.value
          .getBalance(account.value)
          .then((value: any) => {
              balance.value = value;
          })
          .catch(() => {});
      }
    });

    return { balance, formatEther };
  }
});
</script>
