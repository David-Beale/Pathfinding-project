const MinHeap = require('../Heap.js');

const dijkstra = (graph, start, end) => {
  let distances = {};
  for (property in graph) {
    //////////////////////////////////start here refers to the current path 
    distances[property] = [Infinity, start];
  }
  distances[start] = [0, start];
  let toExplore = new MinHeap();
  // arg 1 = edge distance, arg 2 = vertex, arg 3 = current path
  toExplore.add([0, start, start]);
  while (toExplore.count) {
    let temp = toExplore.retrieveMin();
    let currentDistance = temp[0];
    let currentVertex = temp[1];
    let currentPath = temp[2];
    graph[currentVertex].edges.forEach(arrayItem => {
      let edgeDist = arrayItem[1];
      let neighbour = arrayItem[0];
      let newDistance = currentDistance + edgeDist;
      let newPath = currentPath + ' -> ' + neighbour;
      //if newdistance is less than stored distance for that vertex
      if (newDistance < distances[neighbour][0]) {
        distances[neighbour][0] = newDistance;
        distances[neighbour][1] = newPath;
        toExplore.add([newDistance, neighbour, newPath]);
      }
    });
  }
  return distances[end];
};
module.exports = dijkstra;
// console.log(dijkstra(graph, 'A', 'F'));
