import { getCurrentRoute } from "./url.js"

// each page gets its own state object
const states = new Map()

// make state object globally available for debugging
window.__LIVE_STATES = states

// make liveState a globally available function that can be called from live-pages
window.liveState = (defaultState) => {
  if (defaultState == null) { return }
  const currentPage = getCurrentRoute()
  const currentState = states.get(currentPage)
  if (!currentState) {
    states.set(currentPage, defaultState)
    return defaultState
  }
  return currentState
}
