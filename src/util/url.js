// import cleanupEvents first so we can be sure we can use _addEventListener when subscribing to hashchange event
import "./cleanupEvents.js"

let currentRoute = ""
let currentSearchString = ""
let currentSearchParams = new URLSearchParams()
let currentSearchParamsListener = () => {}

// calls the listener with the URLSearchParams when first invoked
// will call the listener again every time the search param string changes
window.liveSearchParams = (listener) => {
  // there can only be one global search params listener at a time
  currentSearchParamsListener = listener
  currentSearchParamsListener(currentSearchParams)
}

// will update the search param string with the key:value pairs defined by the paramUpdates object (simple js object)
// it will merge keys with the existing URLSearchParams
// if you want to delete a key, you must set it to null
// see live-pages/basics/search-params for examples
window.setLiveSearchParams = (paramUpdates) => {
  const updatedParams = new URLSearchParams(currentSearchParams)
  for (const [key, value] of Object.entries(paramUpdates)) {
    if (value == null) {
      updatedParams.delete(key)
    } else {
      updatedParams.set(key, value)
    }
  }
  window.location.hash = createFullHash(currentRoute, updatedParams.toString())
}

// used by liveState
export const getCurrentRoute = () => {
  return currentRoute
}

const routeListeners = new Set()

// used by setup
export const addRouteChangeListener = (handler) => {
  handler(currentRoute)
  routeListeners.add(handler)
}

export const removeRouteChangeListener = (handler) => {
  routeListeners.delete(handler)
}

const trimSlashRegex = /^([/]*)|[/](?=[/])|([/]*)$/g

// remove starting, trailing, and duplicate slashes
export const trimSlashes = (route) => route.replaceAll(trimSlashRegex, "")

// returns true if the route has changed, false otherwise
const updateRoute = (route) => {
  const trimmedRoute = trimSlashes(route)
  if (route !== trimmedRoute) {
    window.location.hash = trimmedRoute
    return false
  }

  if (currentRoute === trimmedRoute) {
    return false
  }

  currentRoute = trimmedRoute

  for (const listener of routeListeners) {
    listener(currentRoute)
  }
  return true
}

// returns true if the search string has changed, false otherwise
const updateSearchParams = (searchString) => {
  if (searchString === currentSearchString) {
    return false
  }

  currentSearchString = searchString
  currentSearchParams = new URLSearchParams(currentSearchString)
  return true
}

const getRouteAndSearchString = () => {
  const fullHash = window.location.hash.substring(1)
  const searchStart = fullHash.indexOf("?")

  if (searchStart < 0) {
    return { route: fullHash, search: "" }
  } else {
    return {
      route: fullHash.substring(0, searchStart),
      search: fullHash.substring(searchStart + 1),
    }
  }
}

const createFullHash = (route, searchString) => {
  return searchString.length === 0 ? route : `${route}?${searchString}`
}

const onHashChange = () => {
  const { route, search } = getRouteAndSearchString()
  const routedUpdated = updateRoute(route)
  const searchUpdated = updateSearchParams(search)
  if (routedUpdated || searchUpdated) {
    currentSearchParamsListener(currentSearchParams)
  }
}

onHashChange()
window._addEventListener("hashchange", onHashChange)
