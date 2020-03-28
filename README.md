# Pathfinding-project
https://david-beale.github.io/Pathfinding-project/

![screenshot](https://user-images.githubusercontent.com/59053870/77824068-affc4500-70f7-11ea-86c1-b7d16cf41b56.jpg)

This is my 1 week solo project which is based on Dijkstra's algorithm. The purpose of the project was to visualise the pathfinding algorithm in real-time and make the application interactive and user-friendly. I used this an an opportunity to apply the knowledge I gained so far and challenge myself to develop a functinoal program without any step by step tutorials/guides.

## How to use it
###### There is a tips icon which gives the user some basic instructions:
-Right click the map to select a point and to move the user vehicle.
-Left click and drag to move the map.
-Use the scroll wheel to zoom in and out.

###### Main buttons: 
-Clicking "shortest distance" or "fastest time" will set the default pahtfinding algorithm.
-Clicking "compare" allows the user to compare the 2 algorithms. Differences will only arise when congestion occurs.

###### Click the menu item to access additional features:
-Start/stop will pause the program.
-Toggle functional traffic lights on/off.
-Toggle camera lock will center the camera on the vehicle.
-Toggle collision boxes/traffic visuals display some of the inner workings of the app.
-Add/remove roadworks limits the speed of all vehicles.
-Speed sliders will adjust the vehicle speeds.
-Enter number of computer cars to populate the map. Note: Performance issues arise when this number gets too high (over 1000).

## Features
- Distance based pathfinding will determine the shortest route to the destination.
- Time based pathfinding estimates the quickest route based on data gathered from other vehicles.
- Comparison function will display the two routes, as well as total distance and the estimated time for each path.
- Curved trajectories - the user vehicle will follow a curved trajectory when turning. I tried implementing this feature for all vehicles; however, the simplistic pathfinding of these vehicles resulted in a high probability of irreversible gridlock at junctions.
- Traffic lights - vehicles will stop and queue when the light is red or yellow and will continue on green lights.
- Collision prevention - vehicles will stop when the vehicle in front stops. They will also slow down when the vehicle in front slows down, or when road conditions require it.
- In transit destination change - the user can change the destination while the vehicle is still enroute to another destination. The vehicle will calculate and store the new path, and when the vehicle has reached the next vertex, this path will be loaded and followed.
- Camera - the user can maipulate the camera view by dragging the map around, or zooming in and out. The user can also lock the camera onto the vehicle, and will follow the it until it is disabled.
- Visual click feedback - a pulse is created when the user right clicks on the road.

## Installation
The app uses plain HTML so it can be accessed directly from the html file. If any changes are made to the script files, the following command is required to bundle the script files (ensure you are inside the scripts folder when running):

`browserify main.js > bundle.js`
