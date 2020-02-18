
class Graph {
  constructor(directed = false) {
    this.directed = directed;
    this.graphObj = {};
  }
  addVertex (vertex) {
    this.graphObj[vertex.value] = vertex;
  }
  addEdge (fromVertex, toVertex, weight = 0) {
    this.graphObj[fromVertex.value].addEdge(toVertex.value, weight);
    if (this.directed === false) {
      this.graphObj[toVertex.value].addEdge(fromVertex.value, weight);
    }
  }
  findPath (startVertex, endVertex) {
    let start = [startVertex];
    let seen = {};
    let currentVertex;
    while (start.length > 0) {
      currentVertex = start.shift();
      seen[currentVertex] = true;
      // console.log(currentVertex);
      if (currentVertex === endVertex) {
        return true;
      } else {
        let vertex = this.graphObj[currentVertex];
        let nextVertices = vertex.getEdges(vertex);
        nextVertices = nextVertices.filter(vertex => {
          return (!seen[vertex]);
        });
        start.push(...nextVertices);
      }
     
    }
    return false;
  }
}



module.exports = Graph;