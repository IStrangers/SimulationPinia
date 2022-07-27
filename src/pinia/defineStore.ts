import { computed, effectScope, getCurrentInstance, inject, reactive, toRefs, watch, WatchOptions } from "vue"
import { addSubscription, triggerSubscription } from "./pubSub"
import { SymbolPinia } from "./rootStore"
import { PiniaInstances } from "./types/PiniaInstances"
import { isFunction, isString, mergeReactiveObject } from "./utils"

function defineStore(nameOrOptions : any,setup : any) {
  if(arguments.length === 0) {
    throw new Error("no arguments, need arguments")
  }
  let name : string
  let options : any
  if(isString(nameOrOptions)) {
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
      if(isFunction(options)) {
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

function createStore(scpoe : any, name : string, pinia : PiniaInstances,actionSubscribes : Array<Function>) {
  
  function $patch(partialStateOrMutation : any) {
    if(isFunction(partialStateOrMutation)) {
      partialStateOrMutation(store)
    } else {
      mergeReactiveObject(store,partialStateOrMutation)
    }
  }

  function $reset() {
    throw Error("Only options storage can be reset")
  }

  function $subscribe(callback : Function,options? : any) {
    scpoe.run(() => watch(pinia.state.value[name],(state) => {
      callback({type: "dirct"},state)
    },options))
  }

  const $onAction = addSubscription.bind(null,actionSubscribes)

  const store = reactive({
    $patch,
    $reset,
    $subscribe,
    $onAction,
  })

  return store
}


function createSetupStore(name : string,setup : Function,pinia : PiniaInstances,isOptions : boolean = false) {
  const { scpoeMap } = pinia

  let scpoe
  const setupStore = pinia.scpoe.run(() => {
    scpoe = effectScope()
    return scpoe.run(() => {
      const res = setup()
      if(isOptions) {
      } else {
        pinia.state.value[name] = res
      }
      return res
    })
  })

  const actionSubscribes : Array<Function> = []
  const store = createStore(scpoe,name,pinia,actionSubscribes)

  function wrapAction(name : string,action : Function) {
    return () => {
      const afterCallbackList : Array<Function> = []
      const onErrorCallbackList : Array<Function> = []
      function after(callback : Function) {
        afterCallbackList.push(callback)
      }
      function onError(callback : Function) {
        onErrorCallbackList.push(callback)
      }
      triggerSubscription(actionSubscribes,{after,onError,store,name})

      let res
      try {
        res = action.apply(store,arguments)
        if(res instanceof Promise) {
          res.then((val) => {
            triggerSubscription(afterCallbackList,val)
          }).catch((error) => {
            triggerSubscription(onErrorCallbackList,error)
            return Promise.reject(error)
          })
        } else {
          triggerSubscription(afterCallbackList,res)
        }
      } catch (error) {
        triggerSubscription(onErrorCallbackList,error)
      }

      return res
    }
  }
  for(let key in setupStore) {
    const prop = setupStore[key]
    if(isFunction(prop)) {
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

  const store = createSetupStore(name,setup,pinia,true)
  store.$reset = function() {
    const newState = state ? state() : {}
    store.$patch(($state : any) => {
      Object.assign($state,newState)
    })
  }
  return store
}

export {
  defineStore,
}