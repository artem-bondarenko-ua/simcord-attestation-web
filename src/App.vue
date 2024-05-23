<template>
  <Layout>
    <router-view />
  </Layout>
</template>

<style>
html,
body {
  background: var(--tg-theme-bg-color);
  overflow: hidden;
}

html{
  font-size: 62.5%;
}
body {
  min-width: 32rem;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  height: 100vh;
  margin: 0 auto;
}
</style>
<script setup lang="ts">
import Layout from "@/components/layout.vue";
</script>