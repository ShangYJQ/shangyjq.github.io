<script setup lang="ts">

import {ref, watchEffect} from "vue";

const rating = ref<number>(0);
const flag = ref<boolean>(false);

watchEffect(() => {
  console.log(rating.value);
  flag.value = rating.value >= 4;
})

</script>

<template>
  <main>
    <hr>
    <t-rate id="rate" :default-value="3" v-model="rating"/>
    <h2>你给了 {{ rating }} 星</h2>
    <h2 v-if='flag'>这是一个高分</h2>

  </main>
</template>\


<style scoped>

main {
  display: flex;
  flex-direction: column;
}


</style>
