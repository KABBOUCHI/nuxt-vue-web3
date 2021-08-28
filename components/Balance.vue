<template>
  <Fragment>
    <span>Balance</span>
    <span role="img" aria-label="gold">
      💰
    </span>
    <span>{{
      balance === null ? "Error" : balance ? `Ξ${formatEther(balance)}` : ""
    }}</span>
  </Fragment>
</template>

<script lang="ts">
import { useWeb3 } from "@kabbouchi/vue-web3";
import {
  defineComponent,
  watchEffect,
  ref,
  onUnmounted,
  watch
} from "@nuxtjs/composition-api";
import { formatEther } from "@ethersproject/units";

export default defineComponent({
  setup() {
    const { account, library, chainId } = useWeb3();
    const balance = ref<number | null>();

    watch([account, library, chainId], () => {
      let stale = false;

      if (!!library.value && !!account.value) {
        library.value
          .getBalance(account.value)
          .then((value: any) => {
            if (!stale) {
              balance.value = value;
            }
          })
          .catch(() => {});
      }
    });

    return { balance, formatEther };
  }
});
</script>
