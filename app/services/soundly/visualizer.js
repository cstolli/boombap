/**
*        _                 _ _
* __   _(_)___ _   _  __ _| (_)_______ _ __
* \ \ / / / __| | | |/ _` | | |_  / _ \ '__|
*  \ V /| \__ \ |_| | (_| | | |/ /  __/ |
*   \_/ |_|___/\__,_|\__,_|_|_/___\___|_|
*
* @Author: Chris Stoll <chrisstoll>
* @Date:   2016-10-28T22:37:58-07:00
* @Email:  chrispstoll@gmail.com
* @Last modified by:   chrisstoll
* @Last modified time: 2016-10-29T01:44:45-07:00
* @License: MIT
*/

/* global HTMLCanvasElement, SVGElement */
const xmlns = 'http://www.w3.org/2000/svg'

function getRect (x, y, width, height, color) {
  const rect = document.createElementNS(xmlns, 'rect')
  rect.setAttribute('x', x)
  rect.setAttribute('y', y)
  rect.setAttribute('width', width)
  rect.setAttribute('height', height)
  rect.setAttribute('fill', color)
  return rect
}

function drawSvgWave (svg, buffer, color) {
  if (!color) color = '#000'

  const g = document.createElementNS(xmlns, 'g')

  var data = buffer.getChannelData(0)
  var step = Math.ceil(data.length / svg.width.baseVal.value)
  var amp = svg.height.baseVal.value / 2
  for (var i = 0; i < svg.width.baseVal.value; i++) {
    var min = 1.0
    var max = -1.0
    for (var j = 0; j < step; j++) {
      var datum = data[(i * step) + j]
      if (datum < min) min = datum
      if (datum > max) max = datum
    }
    g.appendChild(getRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp), color))
  }
  svg.appendChild(g)
}

function drawCanvas (canvas, buffer, color) {
  var ctx = canvas.getContext('2d')
  var width = canvas.width
  var height = canvas.height
  if (color) {
    ctx.fillStyle = color
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  var data = buffer.getChannelData(0)
  var step = Math.ceil(data.length / width)
  var amp = height / 2
  for (var i = 0; i < width; i++) {
    var min = 1.0
    var max = -1.0
    for (var j = 0; j < step; j++) {
      var datum = data[(i * step) + j]
      if (datum < min) min = datum
      if (datum > max) max = datum
    }
    ctx.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp))
  }
}

function draw (canvasOrSvg, buffer, color) {
  if (canvasOrSvg instanceof SVGElement) return drawSvgWave(...arguments)
  if (canvasOrSvg instanceof HTMLCanvasElement) return drawCanvas(...arguments)
}

export default {
  draw
}
