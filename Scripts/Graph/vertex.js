class Vertex {
  constructor(value, x, y) {
    this.value = value;
    this.x = x;
    this.y = y;
    this.edges = [];
    this.occupied = false;
    this.light = 'green'
    this.internalCounter = 0;
    this.averageArray = [];
    this.average = 10;
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
  occupiedCheck () {
    if (this.occupied === true) this.internalCounter++

  }
  occupiedFalse (speed) {
    this.occupied = false;
    if(this.internalCounter>0) {
      this.averageArray.push(this.internalCounter)
      this.internalCounter = 0;
      if (this.averageArray.length > 10) this.averageArray.shift();
      if (this.averageArray.length) {
        this.average = 0;
        for (let i = 0; i < this.averageArray.length; i++) {
          this.average += this.averageArray[i]
        }
        this.average /= this.averageArray.length
      }
    }
  }


  getAverageTime () {
    return this.average;
  }
}

module.exports = Vertex;