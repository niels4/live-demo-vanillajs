/** @returns {SVGElement} */
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

const svgRoot = document.getElementById("svg_root")

const scaledWidth = 0.8
const scaledHeight = scaledWidth / 2
const vertPadding = 12
const clipId = "time-series-clip"

let svgHeight, svgWidth

let minX, minY, maxY, height, width

let valuePath

const drawGraph = () => {
  svgHeight = window.innerHeight
  svgWidth = window.innerWidth
  svgRoot.innerHTML = ""
  svgRoot.setAttribute("height", svgHeight)
  svgRoot.setAttribute("width", svgWidth)
  svgRoot.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`)

  width = Math.round(svgWidth * scaledWidth)
  minX = Math.round((svgWidth - width) / 2)
  height = Math.round(svgHeight * scaledHeight)
  minY = Math.round((svgHeight - height) / 2)
  maxY = minY + height

  const clipRectAttributes = { x: minX, width, y: minY - vertPadding, height: height + vertPadding * 2 }
  drawSvgElement({
    tag: "rect",
    className: "outline",
    attributes: clipRectAttributes,
    parent: svgRoot,
  })

  const clipPath = drawSvgElement({
    tag: "clipPath",
    attributes: { id: clipId },
    parent: svgRoot,
  })

  drawSvgElement({
    tag: "rect",
    attributes: clipRectAttributes,
    parent: clipPath,
  })

  const clippedGroup = drawSvgElement({
    tag: "g",
    attributes: { "clip-path": `url(#${clipId})` },
    parent: svgRoot,
  })

  valuePath = drawSvgElement({
    tag: "path",
    attributes: { d: "" },
    className: "time_series_path",
    parent: clippedGroup,
  })
}

const triggerButton = document.getElementById("trigger_button")

const dataWindowSize = 30
const dataWindowInterval = 1000

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

const animationProps = { duration: 1000, easing: "linear", iterations: 1, fill: "forwards" }

const onTick = async () => {
  scheduleNextTick()
  const prevEndTime = state.dataWindow.at(-1).time
  const newTime = prevEndTime + dataWindowInterval
  state.dataWindow.shift()
  state.dataWindow.push({ time: newTime, value: state.currentActivityCount })
  state.currentActivityCount = 0

  const { path, valueScale } = processDataWindow(state.dataWindow)
  valuePath.setAttribute("d", path)

  const intervalWidth = width / (dataWindowSize - 2)
  const animationKeyFrames = [
    {
      transform: `translateX(${minX}px) translateY(${maxY}px) scaleX(${intervalWidth}) scaleY(${-state.prevValueScale})`,
    },
    {
      transform: `translateX(${minX - intervalWidth}px) translateY(${maxY}px) scaleX(${intervalWidth}) scaleY(${-valueScale})`,
    },
  ]

  state.prevValueScale = valueScale
  valuePath.animate(animationKeyFrames, animationProps)
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

drawGraph()
window.addEventListener("resize", drawGraph)

console.log("time series")
