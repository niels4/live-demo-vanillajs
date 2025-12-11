const TWO_PI = 2 * Math.PI
const MAX_ANGLE_DELTA = 0.99999

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

const drawWedge = ({ startAngle, angleDelta, innerRadius, radiusDelta, className, parent }) => {
  if (angleDelta < 0) {
    angleDelta = 0
  }
  if (angleDelta > MAX_ANGLE_DELTA) {
    angleDelta = MAX_ANGLE_DELTA
  }

  const startAngleRadians = (startAngle % 1) * TWO_PI
  const endAngleRadians = ((startAngle + angleDelta) % 1) * TWO_PI
  const outerRadius = innerRadius + radiusDelta
  const largeArcFlag = angleDelta % 1 > 0.5 ? "1" : "0"

  const startX1 = Math.cos(startAngleRadians) * innerRadius
  const startY1 = -Math.sin(startAngleRadians) * innerRadius
  const startX2 = Math.cos(startAngleRadians) * outerRadius
  const startY2 = -Math.sin(startAngleRadians) * outerRadius
  const endX1 = Math.cos(endAngleRadians) * innerRadius
  const endY1 = -Math.sin(endAngleRadians) * innerRadius
  const endX2 = Math.cos(endAngleRadians) * outerRadius
  const endY2 = -Math.sin(endAngleRadians) * outerRadius

  const d = `
M ${startX1} ${startY1}
A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${endX1} ${endY1}
L ${endX2} ${endY2}
A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${startX2} ${startY2}
Z
`
  return drawSvgElement({ tag: "path", attributes: { d }, className, parent })
}

const polarToCartesian = (angle, radius) => {
  const angleRadians = (angle % 1) * TWO_PI
  const x = Math.cos(angleRadians) * radius
  const y = -Math.sin(angleRadians) * radius
  return [x, y]
}

const innerRingRadius = 0.36
const outerRingRadius = 0.6
const outerArcSize = 0.151
const numWedges = 5
const wedgeSpacing = 0.013
const wedgeWidth = 0.08

const drawSessionWedges = ({ direction = 1, parent }) => {
  const totalStartAngle = 0.25 + (direction * outerArcSize) / 2
  const totalAngleDelta = 0.5 - outerArcSize - wedgeSpacing
  const wedgeAngleDelta = totalAngleDelta / numWedges - wedgeSpacing
  const innerRadius = outerRingRadius - wedgeWidth / 2
  for (let i = 0; i < numWedges; i++) {
    let startAngle = totalStartAngle + direction * (i + 1) * wedgeSpacing + direction * i * wedgeAngleDelta
    if (direction === -1) {
      startAngle -= wedgeAngleDelta
    }
    drawWedge({
      startAngle,
      angleDelta: wedgeAngleDelta,
      innerRadius,
      radiusDelta: wedgeWidth,
      className: "wedge_node",
      parent,
    })
  }
}

const rootNode = document.getElementById("svg_root")
rootNode.innerHTML = ""

drawSvgElement({
  tag: "circle",
  attributes: { cx: 0, cy: 0, r: 1 },
  className: "gold_ring",
  parent: rootNode,
})

drawSvgElement({
  tag: "circle",
  attributes: { cx: -0.097, cy: -0.112, r: 0.029 },
  className: "test_dot",
  parent: rootNode,
})

let [testCx, testCy] = polarToCartesian(8.069, 0.458)
drawSvgElement({
  tag: "circle",
  attributes: { cx: testCx, cy: testCy, r: 0.029 },
  className: "test_dot",
  parent: rootNode,
})

drawWedge({
  startAngle: 0.316,
  angleDelta: 0.212,
  innerRadius: 0.374,
  radiusDelta: 0.15,
  className: "test_dot",
  parent: rootNode,
})

drawWedge({
  startAngle: 0.746,
  angleDelta: 0.156,
  innerRadius: 0,
  radiusDelta: 0.46,
  className: "test_dot",
  parent: rootNode,
})

drawSvgElement({
  tag: "circle",
  attributes: { cx: 0, cy: 0, r: innerRingRadius },
  className: "gold_ring",
  parent: rootNode,
})

drawSessionWedges({ direction: 1, parent: rootNode })
drawSessionWedges({ direction: -1, parent: rootNode })

console.log("Circles with SVG")
