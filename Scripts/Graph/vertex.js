class Vertex {
  constructor (value,x,y) {
    this.value = value;
    this.x = x;
    this.y = y;
    this.edges = [];
    this.occupied = false;
    this.light = 'green'
  }
  getEdges () {
    let newArr = [];
    for (let i = 0; i < this.edges.length; i++) {
      newArr.push(this.edges[i][0]);
    }
    return newArr;
  }
  addEdge (vertex, weight = 1) {
    this.edges.push([vertex, weight]);
  }
}

module.exports = Vertex;