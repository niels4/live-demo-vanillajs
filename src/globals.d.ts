type LiveSearchListener = (params: object) => void

type LiveSearchParams = (listener: LiveSearchListener) => void

type SetLiveSearchParams = (paramUpdates: object) => void

type LiveState = (defaultState: object) => object

interface EventTarget {
  _addEventListener: typeof EventTarget.prototype.addEventListener
}

interface Window {
  liveSearchParams: LiveSearchParams
  liveState: LiveState
  setLiveSearchParams: SetLiveSearchParams
  __LIVE_STATES: Map<string, object>
}
