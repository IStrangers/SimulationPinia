function addSubscription(subscriptions : Array<Function>,cb : Function) {
  subscriptions.push(cb)

  return function removeSubscription() {
    const idx = subscriptions.indexOf(cb)
    if(idx > -1) {
      subscriptions.splice(idx,1)
    }
  }
}

function triggerSubscription(subscriptions : Array<Function>,...args : any) {
  subscriptions.forEach(cb => cb(...args))
}

export {
  addSubscription,
  triggerSubscription,
}