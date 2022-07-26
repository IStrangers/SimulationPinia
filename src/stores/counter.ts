import { defineStore } from "../pinia"

const useCounterStore = defineStore("counter",{
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

export {
  useCounterStore
}