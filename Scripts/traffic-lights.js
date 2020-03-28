/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const { XR, HR, TB, TT, VR, TR, TL, TLC, TRC, BRC, BLC, TrLiU1, TrLiL1, TrLiR1, TrLiD1, TrLiU2, TrLiL2, TrLiR2, TrLiD2 } = require('./tiles')
const { mapOfVertices } = require('./map')

const left = [TrLiL1, TrLiL2];
const right = [TrLiR1, TrLiR2];
const up = [TrLiU1, TrLiU2];
const down = [TrLiD1, TrLiD2];
const lights = [...up, ...down, ...left, ...right];
const arrayOfTrafficLights = require('./traffic-light-data')

const drawLights = (counter, map, override) => {
  for (let i = 0; i < arrayOfTrafficLights.length; i++) {
    for (let j = 0; j < arrayOfTrafficLights[0].length; j++) {
      let func = arrayOfTrafficLights[i][j];
      //This if statement ensures than any other function is ignored. I think this is now deprecated.
      if (lights.includes(func)) {
        let color
        //traffic lights can be disabled using override.
        if(override) {
          color = 'green'
        }
        //func will draw the traffic lights depending on the traffic light data array. Counter keeps track of what color the lights should be.
        else {color = func(j * 100, i * 100, counter)}
        //The vertex contains the traffic light info, therefore it needs to be updated.
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