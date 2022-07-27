import { effectScope, markRaw, ref } from "vue"
import { SymbolPinia } from "./rootStore"
import { PiniaInstances } from "./types/PiniaInstances"

function createPinia() : PiniaInstances {
  const scpoe = effectScope(true)
  const state = scpoe.run(() => ref({}))
  const plugins : Array<any> = []

  const pinia : PiniaInstances = markRaw({
    __Vue__ : undefined,
    state,
    scpoe,
    scpoeMap : new Map<string,any>(),
    plugins,
    install(app : any) {
      pinia.__Vue__ = app
      app.provide(SymbolPinia,pinia)
      app.config.globalProperties.$pinia = pinia
    },
    use(plugin : any) {
      plugins.push(plugin)
      return this
    }
  })
  return pinia
}

export {
  createPinia,
}