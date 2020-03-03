/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const { drawRoadWorks } = require('./tiles')
const { map } = require('./map')


const roadWorks = () => {
  let arrayOfVertices = Object.keys(map.graphObj);
  for (let i = 0; i < arrayOfVertices.length; i++) {
    let vertex = map.graphObj[arrayOfVertices[i]]
    if (vertex.roadWorks) {
      drawRoadWorks(vertex.x, vertex.y)
    }
  }
}

module.exports = roadWorks;