<script setup lang="ts">
  import { useCounterStore } from "./stores/counter"

  const store = useCounterStore()
  const handleClick = () => {
    store.count++
  }
  console.log(store)
</script>

<template>
  计数器： {{store.count}}
  双倍数： {{store.doubleCount}}
  <button @click="handleClick">点击</button>
</template>

<style scoped>

</style>
