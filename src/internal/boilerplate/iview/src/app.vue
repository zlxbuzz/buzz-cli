<template>
  <div>
    <hello></hello>
    <router-view></router-view>
  </div>
</template>
<script>
import Hello from "@/components/hello";
export default {
  data() {
    return {};
  },
  components: {
    Hello
  }
};
</script>
