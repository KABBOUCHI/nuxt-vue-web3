<template>
  <Fragment>
    <span>Account</span>
    <span role="img" aria-label="robot">
      🤖
    </span>
    <span>
      {{
        account === null
          ? "-"
          : account
          ? `${account.substring(0, 6)}...${account.substring(
              account.length - 4
            )}`
          : ""
      }}
    </span>
  </Fragment>
</template>

<script lang="ts">
import { useWeb3 } from "@kabbouchi/vue-web3";
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  setup() {
    const { account } = useWeb3();

    return { account };
  }
});
</script>
