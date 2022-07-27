import { PiniaInstances } from "./types/PiniaInstances"

const SymbolPinia = Symbol()

let piniaInstances : PiniaInstances | null = null
function getPiniaInstance() {
  return piniaInstances
}
function setPiniaInstance(pinia : PiniaInstances) {
  piniaInstances = pinia
}

export {
  SymbolPinia,
  getPiniaInstance,
  setPiniaInstance,
}