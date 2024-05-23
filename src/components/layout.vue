<template>
  <ExpandedViewport />

  <div
    :style="{height:`${viewportHeight}px`}"
    class="layout"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ExpandedViewport, useWebAppTheme, useWebAppViewport } from "vue-tg";
import { onMounted } from "vue";

const { viewportHeight } = useWebAppViewport();
const { setHeaderColor } = useWebAppTheme();

onMounted(() => {
  setHeaderColor("#e27e39");
});
</script>

<style>
.layout {
  padding: 16px;
  position: relative;
}
</style>