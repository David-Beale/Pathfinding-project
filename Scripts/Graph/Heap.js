class MinHeap {
  constructor() {
    this.heapList = [null];
    this.count = 0;
  }
  add (value) {
    this.count++;
    this.heapList.push(value);
    this.heapifyUp();
  }
  heapifyUp () {
    let index = this.count;
    while (this.parentIndex(index) > 0) {
      let child = this.heapList[index];
      let parent = this.heapList[this.parentIndex(index)];
      if (parent[0] > child[0]) {
        this.heapList[index] = parent;
        this.heapList[this.parentIndex(index)] = child;
      }
      index = this.parentIndex(index);
    }
  }
  heapifyDown () {
    let index = 1;
    while (this.childExists(index)) {
      let smallerChildIndex = this.getSmallerChildIndex(index);
      let parent = this.heapList[index];
      let child = this.heapList[smallerChildIndex];
      if (parent[0] > child[0]) {
        this.heapList[smallerChildIndex] = parent;
        this.heapList[index] = child;
      }
      index = smallerChildIndex;
    }
  }
  retrieveMin () {
    if (this.count === 0) {
      return null;
    }
    let min = this.heapList[1];
    this.heapList[1] = this.heapList[this.count];
    this.count--;
    this.heapList.pop();
    this.heapifyDown();
    return min;
  }
  parentIndex (index) {
    return Math.floor(index / 2);
  }
  leftChildIndex (index) {
    return index * 2;
  }
  rightChildIndex (index) {
    return index * 2 + 1;
  }
  getSmallerChildIndex (index) {
    if (this.rightChildIndex(index) > this.count) {
      return this.leftChildIndex(index);
    }
    let leftChild = this.heapList[this.leftChildIndex(index)];
    let rightChild = this.heapList[this.rightChildIndex(index)];
    if (leftChild[0] < rightChild[0]) {
      return this.leftChildIndex(index);
    } else {
      return this.rightChildIndex(index);
    }
  }
  childExists (index) {
    return this.leftChildIndex(index) <= this.count;
  }
}
module.exports = MinHeap;
// let asd = new MinHeap();
// asd.add([42,'A']);
// console.log(asd.retrieveMin());
// console.log(asd.heapList);

// let heap = new MinHeap();
// heap.add([42,'A']);
// console.log(heap.retrieveMin());
// console.log(heap.heapList);
// // console.log( ['A',44] > ['Z',41]);
// heap.add([42,'A']);
// heap.add([10,'B']);
// heap.add([5,'B']);
// heap.add([2,'B']);
// heap.add([41,'B']);
// heap.add([55,'B']);

// heap.add(25);
// heap.add(99);
// heap.add(16);
// heap.add(2);
// heap.add(67);

// console.log(heap.retrieveMin());
// console.log(heap.retrieveMin());
// console.log(heap.retrieveMin());
// console.log(heap.retrieveMin());
// console.log(heap.retrieveMin());
// console.log(heap.retrieveMin());
// console.log(heap.retrieveMin());
// console.log(heap.retrieveMin());
// console.log(heap.heapList);