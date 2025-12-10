import { WebsocketClient } from "./WebsocketClient.js"
import { cleanupAll } from "../util/cleanupEvents.js"

const PROJECT_NAME = "Vanilla JS"
const PORT = 38378
const PAGES_DIRECTORY = "live-pages"
const CSS_FILE = "main.css"
const HTML_FILE = "main.html"
const JS_FILE = "main.js"

const watchedFileTypes = [CSS_FILE, HTML_FILE, JS_FILE]

let watchedFiles = []

export const setWatchedFiles = (route) => {
  const routeSeperator = route === "" ? "" : "/"
  watchedFiles = watchedFileTypes.map((fileType) => {
    return `${PAGES_DIRECTORY}${routeSeperator}${route}/${fileType}`
  })
}

const cssElement = document.getElementById('main_style')
const htmlElement = document.body
let lastJsText = null

const handleCss = (contents) => {
  cssElement.innerText = contents
}

const handleHtml = (contents) => {
  htmlElement.innerHTML = contents
  if (lastJsText) { handleJs(lastJsText) }
}

const handleJs = (contents) => {
  try {
    cleanupAll()
    eval(contents)
    lastJsText = contents
  } catch (e) {
    window._lastEvalError = e
    console.log(e)
  }
}

const fileHandlers = new Map([
  [".css", handleCss],
  [".html", handleHtml],
  [".js", handleJs],
])

const handleWatchFile = (message) => {
  const suffixIndex = message.endsWith.lastIndexOf(".")
  const suffix = message.endsWith.substring(suffixIndex)
  const fileHandler = fileHandlers.get(suffix)
  if (!fileHandler) {
    console.log("No handler for file:", message)
    return
  }
  fileHandler(message.contents)
}

const handleLogMessage = (message) => {
  console.log("LOG:", message)
}

const messageHandlers = new Map([
  ["watch-file", handleWatchFile],
  ["watch-log-messages", handleLogMessage],
])

const handleMessage = (message) => {
  const messageHandler = messageHandlers.get(message.method)
  if (!messageHandler) {
    console.log("Uknown message method:", message)
    return
  }
  messageHandler(message)
}

const ws = new WebsocketClient({ port: PORT })
ws.emitter.on('socket-open', () => {
  ws.sendMessage({ method: "init", name: PROJECT_NAME })
  ws.sendMessage({ method: "watch-log-messages" })
  subscribeWatchers()
})
ws.emitter.on('message', handleMessage)

export const subscribeWatchers = () => {
  watchedFiles.forEach((endsWith) => {
    ws.sendMessage({ method: "watch-file", endsWith })
  })
}

export const unsubscribeWatchers = () => {
  watchedFiles.forEach((endsWith) => {
    ws.sendMessage({ method: "unwatch-file", endsWith })
  })
}

export const initFiles = async () => {
  lastJsText = null
  const promises = watchedFiles.map(endsWith => fetch(endsWith).then(r => r.text()))
  const files = await Promise.all(promises)
  files.forEach((contents, i) => {
    const endsWith = watchedFiles[i]
    handleWatchFile({ endsWith, contents })
  })
}

