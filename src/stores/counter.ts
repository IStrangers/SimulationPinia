import { computed, reactive, toRefs } from "vue"
import { defineStore } from "../pinia"

const useCounterOptionsStore = defineStore("counter",{
  state: () => ({count: 0}),
  getters: {
    doubleCount: (store : any) => store.count * 2
  },
  actions: {
    increment() {
      this.count++
    }
  }
})

const useCounterSetupStore = defineStore("counter",() => {
  const state = reactive({count: 0})
  const doubleCount = computed(() => state.count * 2)
  const increment = () => state.count++
  return {...toRefs(state),doubleCount,increment}
})

export {
  useCounterOptionsStore,
  useCounterSetupStore,
}