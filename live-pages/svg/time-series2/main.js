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

const createLinearScale = (domainMin, domainMax, rangeMin, rangeMax) => {
  const domainSize = domainMax - domainMin
  if (domainSize === 0) {
    return () => rangeMin
  }
  const rangeSize = rangeMax - rangeMin
  const ratio = rangeSize / domainSize

  return (domainValue) => (domainValue - domainMin) * ratio + rangeMin
}

const getSeriesWindowInfo = (series) => {
  const startTime = series.at(0).time
  const endTime = series.at(-2).time
  let maxValue = 0
  series.forEach(({ value }) => {
    if (value > maxValue) {
      maxValue = value
    }
  })

  return { startTime, endTime, maxValue }
}

const coordsToPathData = (coords) => "M " + coords.map((coord) => coord.join(",")).join(" L ")

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
const maxX = minX + width
const maxY = minY + height
const clipMinY = minY - borderWidth / 2 - vertPadding
const clipHeight = height + borderWidth + vertPadding * 2
const clipMinX = minX - borderWidth / 2
const clipWidth = width + borderWidth

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

drawSvgElement({
  tag: "rect",
  className: "outline",
  attributes: clipRectAttributes,
  parent: rootNode,
})

const clippedGroup = drawSvgElement({
  tag: "g",
  attributes: { "clip-path": `url(#${clipId})` },
  parent: rootNode,
})

const dataWindowSize = 30
const dataWindowInterval = 1000
const intervalWidth = width / dataWindowSize - borderWidth * 2

const initDataWindow = () => {
  const now = new Date()
  now.setMilliseconds(0)
  const endTime = now.valueOf()
  return Array.from({ length: dataWindowSize }, (_, i) => ({
    time: endTime - (dataWindowSize - 1 - i) * dataWindowInterval,
    value: 0,
  }))
}

const pathFromDataWindow = (dataWindow) => {
  const { startTime, endTime, maxValue } = getSeriesWindowInfo(dataWindow)

  let valueScale = createLinearScale(0, maxValue, maxY, minY) // in svg, y increases as it goes down, so we need to flip max and min in the range
  let timeScale = createLinearScale(startTime, endTime, minX, maxX)

  const pathCoords = dataWindow.map(({ time, value }) => {
    return [timeScale(time), valueScale(value)]
  })

  return coordsToPathData(pathCoords)
}

const pathFromDataWindow3 = (dataWindow) => {
  const { startTime, endTime, maxValue } = getSeriesWindowInfo(dataWindow)

  let valueScale = (x) => x
  let timeScale = (x) => x - startTime

  const pathCoords = dataWindow.map(({ time, value }) => {
    return [timeScale(time), valueScale(value)]
  })

  return coordsToPathData(pathCoords)
}

const pathFromDataWindow2 = (dataWindow) =>
  "M " + dataWindow.map((point) => `${point.time},${point.value}`).join(" L ")

const intialDataWindow = initDataWindow()
intialDataWindow[0].value = 0.05
intialDataWindow[1].value = 0.5
intialDataWindow[8].value = 0.37
intialDataWindow[11].value = 0.37
intialDataWindow[21].value = 2

const state = liveState({
  currentActivityCount: 0,
  dataWindow: intialDataWindow,
  activityTimeout: null,
})
clearTimeout(state.activityTimeout)

const valuePath = drawSvgElement({
  tag: "path",
  attributes: {
    d: pathFromDataWindow(state.dataWindow),
    transform: `translate(${-0.1}, 0)`,
  },
  className: "time_series_path",
  parent: rootNode,
})

const { startTime, endTime, maxValue } = getSeriesWindowInfo(intialDataWindow)
const pathData = pathFromDataWindow3(intialDataWindow)

const scaledGroup = drawSvgElement({
  tag: "g",
  attributes: { transform: `translate(0.05, 0) scale(${1 / (1000 * intialDataWindow.length)}, 1)` },
  parent: rootNode,
})

const valuePath2 = drawSvgElement({
  tag: "path",
  attributes: {
    d: pathData,
  },
  className: "time_series_path2",
  parent: scaledGroup,
})

// const valuePath3 = drawSvgElement({
//   tag: "path",
//   attributes: {
//     d: pathData,
//   },
//   className: "time_series_path3",
//   parent: rootNode,
// })

const animationKeyFrames = [{ transform: "translateX(0)" }, { transform: `translateX(-${intervalWidth}pt)` }]
const animationProps = { duration: 1000, easing: "linear", iterations: 1, fill: "forwards" }

const onTick = () => {
  scheduleNextTick()
  const prevEndTime = state.dataWindow.at(-1).time
  const newTime = prevEndTime + dataWindowInterval
  state.dataWindow.shift()
  state.dataWindow.push({ time: newTime, value: state.currentActivityCount })
  state.currentActivityCount = 0

  valuePath.setAttribute("d", pathFromDataWindow(state.dataWindow))
  valuePath.animate(animationKeyFrames, animationProps)
}

const scheduleNextTick = () => {
  const nowMillis = new Date().getMilliseconds()
  const millisUntilNextSecond = 1000 - nowMillis
  state.activityTimeout = setTimeout(onTick, millisUntilNextSecond)
}

// scheduleNextTick()

triggerButton.addEventListener("click", () => {
  state.currentActivityCount++
})

console.log("time series")
