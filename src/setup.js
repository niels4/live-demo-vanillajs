import { initFiles, subscribeWatchers, unsubscribeWatchers, setWatchedFiles } from "./wtr/wtr-setup.js"
import { addRouteChangeListener } from "./util/url.js"
// make sure liveState is available globally
import "./util/liveState.js"

addRouteChangeListener(async (route) => {
  unsubscribeWatchers()
  setWatchedFiles(route)
  await initFiles()
  subscribeWatchers()
})
