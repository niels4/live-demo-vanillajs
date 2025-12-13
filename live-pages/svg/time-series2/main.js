const drawSvgElement = ({ tag, attributes = {}, className = "", parent }) => {
  const element = document.createElementNS("http://www.w3.org/2000/svg", tag)

  if (className.length > 0) {
    if (Array.isArray(className)) {
      element.classList.add(...className)
    } else {
      element.classList.add(className)
    }
  }

  Object.entries(attributes).forEach(([name, val]) => {
    if (val != null) {
      element.setAttribute(name, val)
    }
  })

  if (parent) {
    parent.append(element)
  }

  return element
}

const rootNode = document.getElementById("svg_root")
rootNode.innerHTML = ""

const triggerButton = document.getElementById("trigger_button")

const svgWidth = 1
const svgHeight = 0.5
const borderWidth = 0.002

const sideMargin = svgWidth * 0.151
const vertMargin = svgHeight * 0.254

const width = svgWidth - sideMargin * 2
const height = svgHeight - vertMargin * 2
const vertPadding = 0.006

const minX = sideMargin
const minY = vertMargin
const maxY = minY + height
// const maxX = minX + width
const clipMinY = minY - vertPadding
const clipHeight = height + vertPadding * 2
const clipMinX = minX
const clipWidth = width

const clipId = "time-series-clip"
const defs = drawSvgElement({
  tag: "defs",
  parent: rootNode,
})

const clipPath = drawSvgElement({
  tag: "clipPath",
  attributes: { id: clipId },
  parent: defs,
})

const clipRectAttributes = { x: clipMinX, y: clipMinY, height: clipHeight, width: clipWidth }

drawSvgElement({
  tag: "rect",
  attributes: clipRectAttributes,
  parent: clipPath,
})

const clippedGroup = drawSvgElement({
  tag: "g",
  attributes: { "clip-path": `url(#${clipId})` },
  parent: rootNode,
})

drawSvgElement({
  tag: "rect",
  className: "outline",
  attributes: clipRectAttributes,
  parent: rootNode,
})

const dataWindowSize = 30
const dataWindowInterval = 1000
const intervalWidth = width / (dataWindowSize - 2)

const initDataWindow = () => {
  const now = new Date()
  now.setMilliseconds(0)
  const endTime = now.valueOf()
  return Array.from({ length: dataWindowSize }, (_, i) => ({
    time: endTime - (dataWindowSize - 1 - i) * dataWindowInterval,
    value: 0,
  }))
}

const processDataWindow = (dataWindow) => {
  let maxValue = 0
  const coords = dataWindow.map(({ value }, i) => {
    if (value > maxValue) {
      maxValue = value
    }
    return `${i},${value}`
  })
  const path = "M " + coords.join(" L ")
  const valueScale = maxValue === 0 ? 1 : height / maxValue
  return { path, valueScale, maxValue }
}

const intialDataWindow = initDataWindow()
// intialDataWindow[0].value = 1
// intialDataWindow[8].value = 1
// intialDataWindow[21].value = 2

const state = liveState({
  currentActivityCount: 0,
  dataWindow: intialDataWindow,
  prevValueScale: 1,
  activityTimeout: null,
})
clearTimeout(state.activityTimeout)

const initialPathInfo = processDataWindow(state.dataWindow)
state.prevValueScale = initialPathInfo.valueScale
const scaledGroup = drawSvgElement({
  tag: "g",
  attributes: {
    transform: `translate(${minX}, ${maxY}) scale(${intervalWidth}, ${-initialPathInfo.valueScale})`,
  },
  parent: clippedGroup,
})

const valuePath = drawSvgElement({
  tag: "path",
  attributes: {
    d: initialPathInfo.path,
  },
  className: "time_series_path",
  parent: scaledGroup,
})

const onTick = () => {
  scheduleNextTick()
  const prevEndTime = state.dataWindow.at(-1).time
  const newTime = prevEndTime + dataWindowInterval
  state.dataWindow.shift()
  state.dataWindow.push({ time: newTime, value: state.currentActivityCount })
  state.currentActivityCount = 0
  const { path, valueScale } = processDataWindow(state.dataWindow)
  valuePath.setAttribute("d", path)
  scaledGroup.style.transition = ""
  scaledGroup.setAttribute(
    "transform",
    `translate(${minX}, ${maxY}) scale(${intervalWidth}, ${-state.prevValueScale})`,
  )
  state.prevValueScale = valueScale

  requestAnimationFrame(() => {
    scaledGroup.style.transition = "all 1s linear"
    scaledGroup.setAttribute(
      "transform",
      `translate(${minX - intervalWidth}, ${maxY}) scale(${intervalWidth}, ${-valueScale})`,
    )
  })
}

const scheduleNextTick = () => {
  const nowMillis = new Date().getMilliseconds()
  const millisUntilNextSecond = 1000 - nowMillis
  state.activityTimeout = setTimeout(onTick, millisUntilNextSecond)
}

scheduleNextTick()

triggerButton.addEventListener("click", () => {
  state.currentActivityCount++
})

console.log("time series")
