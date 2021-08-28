<template>
  <Fragment>
    <span class="font-medium">Chain Id</span>
    <span role="img" aria-label="chain">
      ⛓
    </span>
    <span>{{chainId || ''}}</span>
  </Fragment>
</template>

<script lang="ts">
import { useWeb3 } from "@kabbouchi/vue-web3";
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  setup() {
    const { chainId } = useWeb3();

    return { chainId };
  }
});
</script>
