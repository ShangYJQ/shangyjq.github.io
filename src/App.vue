<script setup lang="ts">
import {RouterLink, RouterView} from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper">
      <nav class="navigation-bar">
        <RouterLink to="/">首页</RouterLink>
        <RouterLink to="/Github">Github</RouterLink>
      </nav>
    </div>
  </header>
  <main>
    <RouterView/>
  </main>
</template>

<style scoped>

header {
  line-height: 1.5;
  max-height: 100vh;
}

.wrapper {
  border-width: 3px;
  border-color: #898989;
  border-style: solid;
  border-radius: 5px;
}

.navigation-bar {
  display: flex;
  gap: 20px;
  padding: 1rem;
  background-color: #f0f0f0;
  border-bottom: 1px solid #ddd;
}

</style>
