const TWO_PI = 2 * Math.PI

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

const drawHorizontalLine = (y = 0, parent) => {
  return drawSvgElement({
    tag: "line",
    className: "grid_line",
    attributes: {
      x1: minValue,
      x2: maxValue,
      y1: y,
      y2: y,
    },
    parent,
  })
}

const drawVerticalLine = (x = 0, parent) => {
  return drawSvgElement({
    tag: "line",
    className: "grid_line",
    attributes: {
      x1: x,
      x2: x,
      y1: minValue,
      y2: maxValue,
    },
    parent,
  })
}

const polarToCartesian = (angle, radius) => {
  const angleRadians = (angle % 1) * TWO_PI
  const x = Math.cos(angleRadians) * radius
  const y = -Math.sin(angleRadians) * radius
  return [x, y]
}

const rootNode = document.getElementById("svg_root")
rootNode.innerHTML = ""

const cartesianGridGroup = drawSvgElement({ tag: "g", parent: rootNode })

const polarGridGroup = drawSvgElement({ tag: "g", parent: rootNode })

const gridSize = 16
const minValue = -1
const maxValue = 1
const valueRange = maxValue - minValue
const cellWidth = valueRange / gridSize

const drawCartesianGrid = () => {
  for (let i = 0; i <= gridSize; i++) {
    const value = minValue + i * cellWidth
    drawHorizontalLine(value, cartesianGridGroup)
    drawVerticalLine(value, cartesianGridGroup)
  }
}

const drawRadialDivision = (r, parent) => {
  if (r === 0) {
    r = 0.002
  }
  return drawSvgElement({
    tag: "circle",
    className: "grid_line",
    attributes: {
      cx: 0,
      cy: 0,
      r,
    },
    parent,
  })
}

const drawAngularDivision = (angle, parent) => {
  const [x1, y1] = polarToCartesian(angle, minRadius)
  const [x2, y2] = polarToCartesian(angle, maxRadius)
  return drawSvgElement({
    tag: "line",
    className: "grid_line",
    attributes: { x1, y1, x2, y2 },
    parent,
  })
}

const radialDivisions = 20
const angularDivisions = 40

const minRadius = 0
const maxRadius = 1
const radiusRange = maxRadius - minRadius
const radiusDiff = radiusRange / radialDivisions

const minAngle = 0
const maxAngle = 1
const angleRange = maxAngle - minAngle
const angleDiff = angleRange / angularDivisions

const drawPolarGrid = () => {
  for (let i = 0; i <= radialDivisions; i++) {
    const r = minRadius + i * radiusDiff
    drawRadialDivision(r, polarGridGroup)
  }
  for (let i = 0; i <= angularDivisions; i++) {
    const angle = minAngle + i * angleDiff
    drawAngularDivision(angle, polarGridGroup)
  }
}

// drawCartesianGrid()
drawPolarGrid()

// cartesian coord point
const [cartX, cartY] = [0.183, -0.338]
drawSvgElement({
  tag: "circle",
  attributes: { cx: cartX, cy: cartY, r: 0.02 },
  className: "test_dot",
  parent: rootNode,
})

// polar coord point
const [polarX, polarY] = polarToCartesian(-0.11, 0.33)
drawSvgElement({
  tag: "circle",
  attributes: { cx: polarX, cy: polarY, r: 0.02 },
  className: "test_dot",
  parent: rootNode,
})

console.log("Polar grid")
