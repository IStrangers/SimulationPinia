import { computed, effectScope, getCurrentInstance, inject, reactive, toRefs } from "vue"
import { SymbolPinia } from "./rootStore"
import { PiniaInstances } from "./types/PiniaInstances"

function defineStore(nameOrOptions : any,setup : any) {
  if(arguments.length === 0) {
    throw new Error("no arguments, need arguments")
  }
  let name : string
  let options : any
  if(typeof nameOrOptions === "string") {
    name = nameOrOptions
    options = setup
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
      if(typeof options === "function") {
        createSetupStore(name,options,pinia)
      } else {
        createOptionsStore(name,options,pinia)
      }
    }
    const store = scpoeMap.get(name)
    return store
  }
  return useStore
}

function createSetupStore(name : string,setup : Function,pinia : PiniaInstances) {
  const store = reactive({})
  const { scpoeMap } = pinia

  const setupStore = pinia.scpoe.run(() => {
    const scpoe = effectScope()
    return scpoe.run(() => setup())
  })

  function wrapAction(name : string,action : Function) {
    return () => {
      const res = action.apply(store,arguments)
      return res
    }
  }
  for(let key in setupStore) {
    const prop = setupStore[key]
    if(typeof prop === "function") {
      setupStore[key] = wrapAction(key,prop)
    }
  }

  Object.assign(store,setupStore)
  scpoeMap.set(name,store)
  return store
}

function createOptionsStore(name : string,options : any,pinia : PiniaInstances) {
  const { state,getters,actions } = options
  
  function setup() {
    pinia.state.value[name] = state ? state() : {}
    const localState = toRefs(pinia.state.value[name])
    return Object.assign(
      localState,
      Object.keys(getters || {}).reduce((computedGetters : any,name : any) => {
        computedGetters[name] = computed(() => {
          return getters[name].call(store,store)
        })
        return computedGetters
      },{}),
      actions
    )
  }

  const store = createSetupStore(name,setup,pinia)
  return store
}

export {
  defineStore,
}