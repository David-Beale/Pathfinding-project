const Graph = require('./Graph/graph');
const Vertex = require('./Graph/vertex');
const {XR, HR, TB, TT, VR, TR, TL, TLC, TRC, BRC, BLC} = require('./tiles')

const arrayOfTiles = 
[ [     0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0],
  [     0,    TLC,     HR,     HR,     HR,     HR,    TRC,      0,      0,      0,      0,      0,      0,      0],
  [     0,     VR,      0,      0,      0,      0,     TR,     HR,     HR,     TB,     HR,     HR,    TRC,      0],
  [     0,     VR,      0,      0,      0,      0,     VR,      0,      0,     VR,      0,      0,     VR,      0],
  [     0,     VR,      0,      0,      0,      0,     VR,      0,      0,     VR,      0,      0,     VR,      0],
  [     0,     VR,      0,      0,      0,      0,     VR,      0,      0,     VR,      0,      0,     VR,      0],
  [     0,     VR,      0,      0,      0,      0,     VR,      0,      0,    BLC,     TB,     HR,     BRC,     0],
  [     0,    BLC,     HR,     HR,     HR,     TB,    BRC,      0,      0,      0,     VR,      0,      0,      0],
  [     0,      0,      0,      0,      0,     VR,      0,      0,      0,      0,     VR,      0,      0,      0],
  [     0,      0,      0,      0,      0,     VR,      0,      0,      0,      0,     VR,      0,      0,      0],
  [     0,      0,      0,      0,      0,    BLC,     HR,     HR,     HR,     HR,    BRC,      0,      0,      0],
]

let idCounter = 1;
let map = new Graph(true);


const drawMap = () => {
  for (let i = 0; i < arrayOfTiles.length; i++) {
    for (let j = 0; j < arrayOfTiles[0].length; j++) {
      let func = arrayOfTiles[i][j]
      if(func) {
        func(j*100,i*100);
      }
    }
  }
}
const setUpGraph = () => {
  let mapOfVertices = []
  //load vertices
  for (let i = 0; i < arrayOfTiles.length; i++) {
    mapOfVertices.push([])
    for (let j = 0; j < arrayOfTiles[0].length; j++) {
      let func = arrayOfTiles[i][j]
      if(func) {
        mapOfVertices[i].push(setUpVertices(idCounter,j,i));
        idCounter++
      } else mapOfVertices[i].push(0);
    }
  }
  //load edges
  for (let i = 0; i < arrayOfTiles.length; i++) {
    for (let j = 0; j < arrayOfTiles[0].length; j++) {
      if(mapOfVertices[i][j]) {
        setUpEdges(mapOfVertices[i][j],j,i,arrayOfTiles[i][j], mapOfVertices)
      }
    }
  }
}


const setUpVertices = (idCounter,x,y) => {
  let vertexA = new Vertex(idCounter+'A',x*100,y*100)
  let vertexB = new Vertex(idCounter+'B',(x*100)+50,y*100)
  let vertexC = new Vertex(idCounter+'C',x*100,(y*100)+50)
  let vertexD = new Vertex(idCounter+'D',(x*100)+50,(y*100)+50)
  map.addVertex(vertexA);
  map.addVertex(vertexB);
  map.addVertex(vertexC);
  map.addVertex(vertexD);
  return [vertexA, vertexB, vertexC, vertexD]
}
const setUpEdges = (vertices,x,y,type, mapOfVertices) => {
  if(type === HR) {
    map.addEdge(vertices[0],vertices[1]);
    map.addEdge(vertices[3],vertices[2]);
    const tileRightVertices = mapOfVertices[y][x+1];
    map.addEdge(vertices[1], tileRightVertices[0]);
    map.addEdge(tileRightVertices[2], vertices[3]);
  }
  if(type === VR) {
    map.addEdge(vertices[2],vertices[0]);
    map.addEdge(vertices[1],vertices[3]);
    const tileDownVertices = mapOfVertices[y+1][x];
    map.addEdge(vertices[3], tileDownVertices[1]);
    map.addEdge(tileDownVertices[0], vertices[2]);
  }
  if(type === TLC) {
    map.addEdge(vertices[2],vertices[0]);
    map.addEdge(vertices[0],vertices[1]);
    const tileDownVertices = mapOfVertices[y+1][x];
    const tileRightVertices = mapOfVertices[y][x+1];
    map.addEdge(vertices[3], tileDownVertices[1]);
    map.addEdge(tileDownVertices[0], vertices[2]);
    map.addEdge(vertices[1], tileRightVertices[0]);
    map.addEdge(tileRightVertices[2], vertices[3]);
  }
  if(type === TRC) {
    map.addEdge(vertices[0],vertices[1]);
    map.addEdge(vertices[1],vertices[3]);
    const tileDownVertices = mapOfVertices[y+1][x];
    map.addEdge(vertices[3], tileDownVertices[1]);
    map.addEdge(tileDownVertices[0], vertices[2]);
  }
  if(type === BLC) {
    map.addEdge(vertices[3],vertices[2]);
    map.addEdge(vertices[2],vertices[0]);
    const tileRightVertices = mapOfVertices[y][x+1];
    map.addEdge(vertices[1], tileRightVertices[0]);
    map.addEdge(tileRightVertices[2], vertices[3]);
  }
  if(type === BRC) {
    map.addEdge(vertices[1],vertices[3]);
    map.addEdge(vertices[3],vertices[2]);
  }
  if(type === TT) {
    map.addEdge(vertices[0],vertices[1]);
    map.addEdge(vertices[3],vertices[2]);
    map.addEdge(vertices[1],vertices[3]);
    map.addEdge(vertices[2],vertices[0]);
    const tileRightVertices = mapOfVertices[y][x+1];
    map.addEdge(vertices[1], tileRightVertices[0]);
    map.addEdge(tileRightVertices[2], vertices[3]);
  }
  if(type === TB) {
    map.addEdge(vertices[0],vertices[1]);
    map.addEdge(vertices[3],vertices[2]);
    map.addEdge(vertices[2],vertices[0]);
    map.addEdge(vertices[1],vertices[3]);
    const tileDownVertices = mapOfVertices[y+1][x];
    const tileRightVertices = mapOfVertices[y][x+1];
    map.addEdge(vertices[3], tileDownVertices[1]);
    map.addEdge(tileDownVertices[0], vertices[2]);
    map.addEdge(vertices[1], tileRightVertices[0]);
    map.addEdge(tileRightVertices[2], vertices[3]);
  }
  if(type === TL) {
    map.addEdge(vertices[2],vertices[0]);
    map.addEdge(vertices[1],vertices[3]);
    map.addEdge(vertices[0],vertices[1]);
    map.addEdge(vertices[3],vertices[2]);
    const tileDownVertices = mapOfVertices[y+1][x];
    map.addEdge(vertices[3], tileDownVertices[1]);
    map.addEdge(tileDownVertices[0], vertices[2]);
  }
  if(type === TR || type === XR) {
    map.addEdge(vertices[2],vertices[0]);
    map.addEdge(vertices[1],vertices[3]);
    map.addEdge(vertices[0],vertices[1]);
    map.addEdge(vertices[3],vertices[2]);
    const tileDownVertices = mapOfVertices[y+1][x];
    const tileRightVertices = mapOfVertices[y][x+1];
    map.addEdge(vertices[3], tileDownVertices[1]);
    map.addEdge(tileDownVertices[0], vertices[2]);
    map.addEdge(vertices[1], tileRightVertices[0]);
    map.addEdge(tileRightVertices[2], vertices[3]);
  }

}
module.exports = {drawMap, setUpGraph, map}