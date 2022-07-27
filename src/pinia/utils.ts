import { isRef } from "vue"

function isString(str : any) {
  return typeof str === "string"
}

function isFunction(fn : any) {
  return typeof fn === "function"
}

function isObject(obj : any) {
  return typeof obj === "object"
}

function mergeReactiveObject(target : any,origin : any) {
  for(let key in origin) {
    if(origin.hasOwnProperty(key)) {
      const targetValue = target[key]
      const originValue = origin[key]
      if(isObject(targetValue) && isObject(originValue) && isRef(originValue)) {
        target[key] = mergeReactiveObject(targetValue,originValue)
      } else {
        target[key] = originValue
      }
    }
  }
  return target
}

function mapState(useStore : any,keysOrMapper : any) {
  return Array.isArray(keysOrMapper) ? keysOrMapper.reduce((reduced,key) => {
    reduced[key] = function() {
      return useStore()[key]
    }
    return reduced
  },{}) : Object.keys(keysOrMapper).reduce((reduced : any,key) => {
    reduced[key] = function() {
      const store = useStore()
      const storeKey = keysOrMapper[key]
      return store[storeKey]
    }
    return reduced
  },{})
}

function mapActions(useStore : any,keysOrMapper : any) {
  return Array.isArray(keysOrMapper) ? keysOrMapper.reduce((reduced,key) => {
    reduced[key] = function(...args : any) {
      return useStore()[key](...args)
    }
    return reduced
  },{}) : Object.keys(keysOrMapper).reduce((reduced : any,key) => {
    reduced[key] = function(...args : any) {
      const store = useStore()
      const storeKey = keysOrMapper[key]
      return store[storeKey](...args)
    }
    return reduced
  },{})
}

function mapWritableState(useStore : any,keysOrMapper : any) {
  return Array.isArray(keysOrMapper) ? keysOrMapper.reduce((reduced,key) => {
    reduced[key] = {
      get() {
        return useStore()[key]
      },
      set(value : any) {
        useStore()[key] = value
      }
    }
    return reduced
  },{}) : Object.keys(keysOrMapper).reduce((reduced : any,key) => {
    const store = useStore()
    const storeKey = keysOrMapper[key]
    reduced[key] = {
      get() {
        return store[storeKey]
      },
      set(value : any) {
        store[storeKey] = value
      }
    }
    return reduced
  },{})
}

export {
  isString,
  isFunction,
  isObject,
  mergeReactiveObject,
  mapState,
  mapActions,
  mapWritableState,
}