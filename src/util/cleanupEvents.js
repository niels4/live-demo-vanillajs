let eventCleanupFuncs = []

export const cleanupAll = () => {
  eventCleanupFuncs.forEach((f) => f())
  eventCleanupFuncs = []
}

// use _addEventListener when you don't want the event to be automatically cleaned up when evaling js changes
EventTarget.prototype._addEventListener = EventTarget.prototype.addEventListener

// automatically clean up event handlers every time we re-eval a js file
EventTarget.prototype.addEventListener = function (eventName, handler) {
  const cleanup = () => this.removeEventListener(eventName, handler)
  eventCleanupFuncs.push(cleanup)
  return this._addEventListener(eventName, handler)
}
