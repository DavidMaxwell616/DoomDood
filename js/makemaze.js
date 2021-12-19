/*
MAXMAZEMAKER ALGORITHM: How it works
The algorithm first creates a [WxH] map of block walls
It then creates a 4 element array of zero values (N,S,E,W)
This will then update to indicate which neighbors of the current cell (e.g. 1,1) to analyze (N, S, E, W)
Availability is based upon potential cells being within map boundaries and cells 2 cells away being available(wall)
e.g. if East and South were available, the end result would be [3,4,0,0]
It then chooses one of those directions at random (e.g. 3 or 4, ignoring trailing zeroes)
It then carves out that cell and progresses 2 cells in the chosen direction
It repeats recursively like that until it finds zero available neighbors 2 cells away
*/
var width;
var height;
var tmpMap = [];

function makemaze(y, x,w,h, scale) {
var array = [];
width = w;
height = h;
for (var y = 0; y < h; y++) {
    array[y] = [];
    tmpMap[y] = [];
    for (var x = 0; x < w; x++) {
      array[y][x] = 1;
      if (array[y][x] < 0) {
        array[y][x] = 0;
      }
      tmpMap[y].push(array[y][x]);
    }
  } 
 
  buildmaze(1, 1,1);
  tmpMap[0][1] = 0;
  tmpMap[w - 1][h - 2] = 0;
    return tmpMap;
}

function buildmaze(y, x, scale) {
  let p1 = 0;
  d = [0, 0, 0, 0];
  tmpMap[y][x] = 0;

  if ((y > 1) && (tmpMap[y - 2][x] > 0)) d[p1++] = 1;
  if ((x > 1) && (tmpMap[y][x - 2] > 0)) d[p1++] = 2;
  if ((y < (height - 2)) && (tmpMap[y + 2][x] > 0)) d[p1++] = 3;
  if ((x < (width - 2)) && (tmpMap[y][x + 2] > 0)) d[p1++] = 4;
  if (p1 == 0) return;
  let rnd = this.game.rnd.integerInRange(0, p1 - 1);
  let p2 = d[rnd];
  switch (p2) {
    case 1:
      tmpMap[y - 1][x] = 0;
      buildmaze(y - 2, x);
      break; //Carve wall to North
    case 2:
      tmpMap[y][x - 1] = 0;
      buildmaze(y, x - 2);
      break; //Carve wall to West
    case 3:
      tmpMap[y + 1][x] = 0;
      buildmaze(y + 2, x);
      break; //Carve wall to South
    case 4:
      tmpMap[y][x + 1] = 0;
      buildmaze(y, x + 2);
      break; //Carve wall to East
  }
  buildmaze(y, x,1);
}