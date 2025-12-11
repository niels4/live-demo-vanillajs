export {}

declare global {
  type LiveSearchListener = (params: object) => void

  function liveState(defaultState: object): object
  function liveSearchParams(listener: LiveSearchListener): void
  function setLiveSearchParams(paramUpdates: object): void

  interface EventTarget {
    _addEventListener: typeof EventTarget.prototype.addEventListener
  }

  interface Window {
    liveState: typeof liveState
    liveSearchParams: typeof liveSearchParams
    setLiveSearchParams: typeof setLiveSearchParams
    __LIVE_STATES: Map<string, object>
  }
}
