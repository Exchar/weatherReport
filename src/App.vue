
<script setup lang="ts">
import {onMounted,ref} from "vue";
import {routes} from "@/router";

const keepAliveViews = ref<string[]>([]);
const routesInfos = routes;
onMounted(()=> {
  const filterViews = routesInfos.filter(i=>i?.meta?.keepAlive);
  keepAliveViews.value = filterViews.map(i=>String(i.name));
});
</script>
<script lang="ts">
export default {
  name: "App"
};
</script>
<template>
  <router-view #default="{Component}">
    <keep-alive :include="keepAliveViews">
      <n-message-provider>
        <component :is="Component"></component>
      </n-message-provider>
    </keep-alive>
  </router-view>
</template>

<style scoped lang="scss">
.top-switch{
  float:right;
  margin-right: 16px;
  margin-top:8px;
}
</style>
