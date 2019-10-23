<template>
  <div>index</div>
</template>
<script>
import { lists } from "@/service/sponsorSvc";
export default {
  created() {
    lists();
  }
};
</script>
