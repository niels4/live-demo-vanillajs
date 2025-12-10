import { getCurrentRoute } from "./url.js"

// each page gets its own state object
const pageStates = new Map()

// make state object globally available for debugging
window.__LIVE_STATES = pageStates

// make liveState a globally available function that can be called from live-pages
window.liveState = (defaultState = {}) => {
  const currentPage = getCurrentRoute()
  const currentState = pageStates.get(currentPage)
  if (!currentState) {
    pageStates.set(currentPage, defaultState)
    return defaultState
  }
  return currentState
}
