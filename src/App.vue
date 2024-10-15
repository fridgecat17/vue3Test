<template>
  <header>
    <div class="wrapper">
      <nav v-if="navList.length > 0">
        <RouterLink v-for="nav in navList" :key="nav.path" :to="nav.path">{{ nav.meta.title }}</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
  <div class="flex items-center gap-15px">
    <a href="https://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44010602013135" target="_blank">粤公网安备 44010602013135</a>
    <a href="https://beian.miit.gov.cn/" target="_blank">粤ICP备2024315700号</a>
  </div>
</template>
<script lang="ts" setup>
import { RouterLink, RouterView } from 'vue-router'
import { computed } from 'vue';
import { PublicStore } from './stores/Public';
const stores = PublicStore()
const navList = computed(() => {
  return stores.navList.filter(route => {
    return route.meta ? route.meta.title : false
  })
})
</script>
<style scoped>
nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 1rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header .wrapper {
    width: 100%;
    height: 50px;
    display: flex;
  }

  nav {
    text-align: left;
    font-size: 1.5rem;
  }
}
</style>
