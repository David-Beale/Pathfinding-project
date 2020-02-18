const Graph = require('./a_graph');
const Vertex = require('./a_vertex');
const dijkstra = require('./a_dijkstra.js');

//New graph
let map = new Graph();
//New stations
let waterloo = new Vertex('Waterloo');
let wandsworth = new Vertex('Wandsworth');
let euston = new Vertex('Euston')
let liverpoolStreet = new Vertex('Liverpool Street');
let home = new Vertex('Home');
let vauxhall = new Vertex('Vauxhall');
let oxfordCircus = new Vertex('Oxford Circus');
let holborn = new Vertex('Holborn');

//add stations to map
map.addVertex(waterloo);
map.addVertex(wandsworth);
map.addVertex(euston);
map.addVertex(liverpoolStreet);
map.addVertex(home);
map.addVertex(vauxhall);
map.addVertex(oxfordCircus);
map.addVertex(holborn);


//add edges to vertices
map.addEdge(waterloo, wandsworth, 20);
map.addEdge(euston, vauxhall, 20);
map.addEdge(oxfordCircus, euston, 5);
map.addEdge(liverpoolStreet, euston, 5);
map.addEdge(home, wandsworth, 20);
map.addEdge(waterloo, vauxhall, 10);
map.addEdge(wandsworth, vauxhall, 10);
map.addEdge(oxfordCircus, vauxhall, 10);
map.addEdge(oxfordCircus, holborn, 10);
map.addEdge(waterloo, holborn, 10);


// console.log(wandsworth.edges);
// console.log(euston.edges);
// console.log(waterloo.edges);
// console.log(map.graphObj['Waterloo']['edges']);
// console.log(map.graphObj['Waterloo'].edges[0]);
// console.log(map.findPath('Waterloo', 'Liverpool Street'));

console.log(dijkstra(map.graphObj, 'Home', 'Holborn'));
