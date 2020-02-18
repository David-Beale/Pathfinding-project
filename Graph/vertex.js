class Vertex {
  constructor (value) {
    this.value = value;
    this.edges = [];
  }
  getEdges () {
    let newArr = [];
    for (let i = 0; i < this.edges.length; i++) {
      newArr.push(this.edges[i][0]);
    }
    return newArr;
  }
  addEdge (vertex, weight = 0) {
    this.edges.push([vertex, weight]);
  }
}

module.exports = Vertex;