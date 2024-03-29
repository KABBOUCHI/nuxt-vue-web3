<template>
  <Fragment>
    <span class="font-medium">Block Number</span>
    <span role="img" aria-label="numbers">
      🔢
    </span>
    <span>{{ blockNumber === null ? "Error" : blockNumber || "" }}</span>
  </Fragment>
</template>

<script lang="ts">
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3 } from "@instadapp/vue-web3";
import { defineComponent, ref, watch } from "@nuxtjs/composition-api";

export default defineComponent({
  setup() {
    const { chainId, library } = useWeb3<Web3Provider>();
    const blockNumber = ref<number | null>();

    watch([chainId, library], (_, __, onInvalidate) => {
      let stale = false;

      const updateBlockNumber = (value: number) => {
        blockNumber.value = value;
      };

      if (!!library.value) {
        library.value
          .getBlockNumber()
          .then((value: number) => {
            if (!stale) {
              blockNumber.value = value;
            }
          })
          .catch(() => {
            if (!stale) {
              blockNumber.value = null;
            }
          });

        library.value.on("block", updateBlockNumber);
      }
      onInvalidate(() => {
        stale = true;
        library.value?.removeListener("block", updateBlockNumber);
        blockNumber.value = undefined;
      });
    });

    return { blockNumber };
  }
});
</script>
