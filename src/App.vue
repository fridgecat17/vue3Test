<template>
  <header>
    <div class="wrapper">
      <nav v-if="navList.length > 0">
        <RouterLink v-for="nav in navList" :key="nav.path" :to="nav.path">{{ nav.meta.title }}</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
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
header {
  line-height: 1.5;
  max-height: 100vh;
}
nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
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
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }
  header .wrapper {
    width: 100%;
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
