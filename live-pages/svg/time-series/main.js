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
  const endTime = series.at(-1).time
  let maxValue = 0
  series.forEach(({ value }) => {
    if (value > maxValue) {
      maxValue = value
    }
  })

  return { startTime, endTime, maxValue }
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
const maxX = minX + width
const maxY = minY + height
const clipMinY = minY - borderWidth / 2 - vertPadding
const clipHeight = height + borderWidth + vertPadding * 2
const clipMinX = minX - borderWidth / 2
const clipWidth = width + borderWidth

drawSvgElement({
  tag: "rect",
  className: "outline",
  attributes: { x: clipMinX, y: clipMinY, height: clipHeight, width: clipWidth },
  parent: rootNode,
})

drawSvgElement({
  tag: "circle",
  className: "test_dot",
  attributes: { cx: 0.713, cy: 0.281, r: 0.009 },
  parent: rootNode,
})

const valuePath = drawSvgElement({
  tag: "path",
  attributes: { d: `M ${minX} ${maxY} L ${maxX} ${maxY}` },
  className: "time_series_path",
  parent: rootNode,
})

const dataWindowSize = 30
const dataWindowInterval = 1000

const initDataWindow = () => {
  const now = new Date()
  now.setMilliseconds(0)
  const startTime = now.valueOf()
  return Array.from({ length: dataWindowSize }, (_, i) => ({
    time: startTime + i * dataWindowInterval,
    value: 0,
  }))
}

const state = liveState({
  currentActivityCount: 0,
  dataWindow: initDataWindow(),
  activityTimeout: null,
})

clearTimeout(state.activityTimeout)
const onTick = () => {
  scheduleNextTick()
  const prevEndTime = state.dataWindow.at(-1).time
  const newTime = prevEndTime + dataWindowInterval
  state.dataWindow.shift()
  state.dataWindow.push({ time: newTime, value: state.currentActivityCount })
  state.currentActivityCount = 0
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
