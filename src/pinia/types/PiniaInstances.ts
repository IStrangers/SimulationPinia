interface PiniaInstances {
  __Vue__ : any
  state : any
  scpoe : any
  scpoeMap : Map<string,any>,
  plugins : Array<any>
  install(app: any): void
}

export {
  type PiniaInstances,
}