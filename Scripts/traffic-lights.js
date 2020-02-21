const { XR, HR, TB, TT, VR, TR, TL, TLC, TRC, BRC, BLC, TrLiU1, TrLiL1, TrLiR1, TrLiD1, TrLiU2, TrLiL2, TrLiR2, TrLiD2 } = require('./tiles')
const { mapOfVertices } = require('./map')

const left = [TrLiL1, TrLiL2];
const right = [TrLiR1, TrLiR2];
const up = [TrLiU1, TrLiU2];
const down = [TrLiD1, TrLiD2];
const lights = [...up, ...down, ...left, ...right];

const arrayOfTrafficLights = 
[ [     0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0],
  [     0,    TLC,     HR,     HR,     HR,     HR, TrLiD2,      0,      0,      0,      0,      0,      0,      0],
  [     0,     VR,      0,      0,      0,      0,     TR,  TrLiL1, TrLiR2,     TB,  TrLiL2,     HR,    TRC,      0],
  [     0,     VR,      0,      0,      0,      0, TrLiU2,      0,      0, TrLiU1,      0,      0,     VR,      0],
  [     0,     VR,      0,      0,      0,      0,     VR,      0,      0,     VR,      0,      0,     VR,      0],
  [     0,     VR,      0,      0,      0,      0,     VR,      0,      0,     VR,      0,      0,     VR,      0],
  [     0,     VR,      0,      0,      0,      0,     VR,      0,      0, TrLiR2,     TB, TrLiL2,     BRC,     0],
  [     0,    BLC,     HR,     HR, TrLiR2,      1, TrLiL2,      0,      0,      0, TrLiU1,      0,      0,      0],
  [     0,      0,      0,      0,      0, TrLiU1,      0,      0,      0,      0,     VR,      0,      0,      0],
  [     0,      0,      0,      0,      0,     VR,      0,      0,      0,      0,     VR,      0,      0,      0],
  [     0,      0,      0,      0,      0,    BLC,     HR,     HR,     HR,     HR,    BRC,      0,      0,      0],
]


const drawLights = (counter, map) => {
  for (let i = 0; i < arrayOfTrafficLights.length; i++) {
    for (let j = 0; j < arrayOfTrafficLights[0].length; j++) {
      let func = arrayOfTrafficLights[i][j];
      if (lights.includes(func)) {
        let color = func(j * 100, i * 100, counter);
        updateVertex(i, j, func, color);
      }
    }
  }
}

const updateVertex = (i, j, func, color) => {
  const vertices = mapOfVertices[i][j];
  let vertex;
  if (left.includes(func)) vertex = vertices[2];
  else if (right.includes(func)) vertex = vertices[1];
  else if (down.includes(func)) vertex = vertices[3];
  else if (up.includes(func)) vertex = vertices[0];
  vertex.light = color;
}
module.exports = drawLights;