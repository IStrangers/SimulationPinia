import { effectScope, getCurrentInstance, inject, reactive } from "vue"
import { SymbolPinia } from "./rootStore"
import { PiniaInstances } from "./types/PiniaInstances"

function defineStore(nameOrOptions : any,options : any) {
  if(arguments.length === 0) {
    throw new Error("no arguments, need arguments")
  }
  let name : string
  if(typeof nameOrOptions === "string") {
    name = nameOrOptions
  } else {
    name = nameOrOptions.name
    options = nameOrOptions
  }

  const useStore = () => {
    const currentInstance = getCurrentInstance()
    const pinia : PiniaInstances | undefined = inject(SymbolPinia)
    if(!currentInstance || !pinia) {
      return
    }
    const { scpoeMap } = pinia
    if(!scpoeMap.has(name)) {
      createOptionsStore(name,options,pinia)
    }
    const store = scpoeMap.get(name)
    return store
  }
  return useStore
}

function createOptionsStore(name : string,options : any,pinia : PiniaInstances) {
  const { state,getters,actions } = options
  const { scpoeMap } = pinia

  let scpoe
  const store = reactive({})
  const setup = () => {
    const localState = pinia.state.value[name] = state ? state() : {}
    return localState
  }
  const setupStore = pinia.scpoe.run(() => {
    scpoe = effectScope()
    return scpoe.run(() => setup())
  })

  Object.assign(store,setupStore)
  scpoeMap.set(name,store)
}

export {
  defineStore,
}