// import cleanupEvents first so we can be sure we can use _addEventListener when subscribing to hashchange event
import "./cleanupEvents.js";

let currentRoute = "";
let currentSearchString = "";
let currentUrlParams = new URLSearchParams();
let currentSearchParamsListener = () => {};

window.liveSearchParams = (listener) => {
  // there can only be one global search params listener at a time
  currentSearchParamsListener = listener;
  currentSearchParamsListener(currentUrlParams);
};

export const getCurrentRoute = () => {
  return currentRoute;
};

const routeListeners = new Set();

export const addRouteChangeListener = (handler) => {
  handler(currentRoute);
  routeListeners.add(handler);
};

export const removeRouteChangeListener = (handler) => {
  routeListeners.delete(handler);
};

const trimSlashRegex = /^([/]*)|[/](?=[/])|([/]*)$/g;

// remove starting, trailing, and duplicate slashes
export const trimSlashes = (route) => route.replaceAll(trimSlashRegex, "");

const updateRoute = (route) => {
  const trimmedRoute = trimSlashes(route);
  if (route !== trimmedRoute) {
    window.location.hash = trimmedRoute;
    return;
  }

  if (currentRoute === trimmedRoute) {
    return;
  }

  currentRoute = trimmedRoute;

  for (const listener of routeListeners) {
    listener(currentRoute);
  }
};

const updateSearchParams = (searchString) => {
  if (searchString === currentSearchString) {
    return false;
  }

  currentSearchString = searchString;
  currentUrlParams = new URLSearchParams(currentSearchString);

  currentSearchParamsListener(currentUrlParams);
  return true;
};

export const getRouteAndSearchString = () => {
  const fullHash = window.location.hash.substring(1);
  const searchStart = fullHash.indexOf("?");

  if (searchStart < 0) {
    return { route: fullHash, search: "" };
  } else {
    return {
      route: fullHash.substring(0, searchStart),
      search: fullHash.substring(searchStart + 1),
    };
  }
};

const onHashChange = () => {
  const { route, search } = getRouteAndSearchString();
  updateRoute(route);
  if (!updateSearchParams(search)) {
    // call the search params change handler when the route updates, even if the search string doesn't change
    currentSearchParamsListener(currentUrlParams);
  }
};

onHashChange();
window._addEventListener("hashchange", onHashChange);
