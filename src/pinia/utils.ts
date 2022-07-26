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

export {
  isString,
  isFunction,
  isObject,
  mergeReactiveObject,
}