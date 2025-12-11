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

const svgWidth = 1
const svgHeight = 0.5

const sidePadding = svgWidth * 0.031
const vertPadding = svgHeight * 0.254

const width = svgWidth - sidePadding * 2
const height = svgHeight - vertPadding * 2

const minX = sidePadding
const minY = vertPadding

drawSvgElement({
  tag: "rect",
  className: "outline",
  attributes: { x: minX, y: minY, height, width },
  parent: rootNode,
})

drawSvgElement({
  tag: "circle",
  className: "test_dot",
  attributes: { cx: 0.843, cy: 0.281, r: 0.009 },
  parent: rootNode,
})

console.log("time series")
