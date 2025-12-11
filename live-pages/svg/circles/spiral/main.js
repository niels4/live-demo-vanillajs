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

const polarToCartesian = (angle, radius) => {
  const angleRadians = (angle % 1) * TWO_PI
  const x = Math.cos(angleRadians) * radius
  const y = -Math.sin(angleRadians) * radius
  return [x, y]
}

const rootNode = document.getElementById("svg_root")
rootNode.innerHTML = ""

// const t = 0.975

let spiralPath = `M 0,0\n`
const totalAngleDiff = 6.057
const totalRadiusDiff = 0.899
const numSpiralSegments = 311
const segmentRadiusDiff = totalRadiusDiff / numSpiralSegments
const segmentAngleDiff = totalAngleDiff / numSpiralSegments
for (let t = 0; t <= numSpiralSegments; t++) {
  const angle = t * segmentAngleDiff
  const radius = t * segmentRadiusDiff
  const [x, y] = polarToCartesian(angle, radius)
  spiralPath += `L ${x},${y}\n`
}

const drawPointOnSpiral = (percentAlongPath = 1) => {
  const angle = totalAngleDiff * percentAlongPath
  const radius = totalRadiusDiff * percentAlongPath
  const [cx, cy] = polarToCartesian(angle, radius)
  drawSvgElement({ tag: "circle", attributes: { cx, cy, r: 0.029 }, className: "test_dot", parent: rootNode })
}

drawSvgElement({ tag: "path", attributes: { d: spiralPath }, className: "test_spiral", parent: rootNode })

drawPointOnSpiral(0.841)

console.log("Circles with SVG")
