<script setup lang="ts">
  import { useCounterOptionsStore,useCounterSetupStore } from "./stores/counter"

  const store = useCounterOptionsStore()
  const handleClick = () => {
    store.increment()
  }
  store.$subscribe((m : any,s : any) => {
    console.log(s)
  })
  //store.$dispose()
</script>

<template>
  计数器： {{store.count}}
  双倍数： {{store.doubleCount}}
  <button @click="handleClick">点击</button>
</template>

<style scoped>

</style>
