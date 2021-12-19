const game = new Phaser.Game(1000, 500, Phaser.CANVAS, 'game', {
  preload,
  create,
  update,
  render,
});

function Player(x, y, direction, inventory) {
  x = x;
  y = y;
  direction = direction;
  maxStamina = 10;
  stamina = maxStamina;
  inventory = inventory;
  weapon = inventory[0];
  paces = 0;
}

function Map(size, skybox, wallTexture, floorTexture) {
  size = size;
  wallGrid = new Uint8Array(size * size);
  skybox = new Bitmap(skyTexturePath, 4000, 1290);
  wallTexture = new Bitmap(wallTexturePath, 1024, 1024);
  floorTexture = new Bitmap(floorTexturePath, 391, 392);
  light = 0;
  objects = [];
}
var bmd;
var MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
var player;
var map;
var resolution = MOBILE ? 160 : 320;
var fov = Math.PI * .4;
var range = MOBILE ? 8 : 14;
var hitDistance = 0;
var width = game.width;
var height = game.height;
var spacing = width / resolution;
var lightRange = 5;
var scale = (game.width + game.height) / 1200;
var CIRCLE = Math.PI * 2;
//console.log('width:' + width + ' height:' + height + ' resolution:' + resolution + ' spacing:' + spacing + ' range:' + range + ' lightrange:' + lightRange + ' scale:' + scale);
var wallTexturePath;
var skyTexturePath;
var floorTexturePath;

function preload() {
  game.load.crossOrigin = 'anonymous';
  // game.scale.pageAlignHorizontally = true;
  // game.scale.pageAlignVertically = true;
  // game.scale.refresh();

  wallTexturePath = '../assets/images/wall_texture.jpg';
  skyTexturePath = '../assets/images/deathvalley_panorama.jpg';
  floorTexturePath = '../assets/images/floor_texture.jpg';

}
function copyPixels2(a,b,c,d,e,f)
{
  "string"==typeof a&&(a=game.cache.getImage(a)),a&&
  bmd.ctx.drawImage(a,b.x,b.y,b.width,b.height,c,d,e,f);
}
function create() {
  game.cursors = game.input.keyboard.createCursorKeys();
  game.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  var inventory = [];
  player = new Player(15.3, -1.2, Math.PI * 0.3, inventory);
  map = new Map(32);
  map.wallGrid[15] = 1;
  map.wallGrid[17] = 1;

  map.wallGrid[15 + 32] = 1;
  //map.wallGrid[16 + 32] = 1;
  map.wallGrid[17 + 32] = 1;
  var objects = [];
  bmd = game.add.bitmapData(game.width, game.height);
  //	bmd.addToWorld();
  game.add.sprite(0, 0, bmd);
  //	Disables anti-aliasing when we draw sprites to the BitmapData
  bmd.smoothed = false;
  drawSky(player.direction, map.skybox, map.light);
  drawColumns(player, map, objects);
  // console.log(width);

  // drawWeapon(player.weapon, player.paces);
  drawMiniMap(map, player);
}
// Draw the mini map
function drawMiniMap() {
  // Map is smaller than world, determine shrink factor
  var shrinkFactor = parseFloat(wallSize / mapBlockSize);

  // Draw black background
  drawRectangle(mapOffsetX, mapOffsetY,
    map.wallGrid.length * mapBlockSize, map.wallGrid.length * mapBlockSize,
    'black');
  // Draw walls
  for (var y = 0; y < map.wallGrid.length; y++) {

    for (var x = 0; x < map.wallGrid[0].length; x++) {

      if (map.wallGrid[y][x] !== 0) {
        /*    dot[y][x].x=mapOffsetX + x * mapBlockSize;
            dot[y][x].y = mapOffsetY + y * mapBlockSize;
            dot[y][x].width = mapBlockSize;
            dot[y][x].height = mapBlockSize; */
        drawing.rectangle(mapOffsetX + x * mapBlockSize, mapOffsetY + y * mapBlockSize,
          mapBlockSize, mapBlockSize,
          'gray');
      }
    }
  }
}
function getMapValue(x, y) {
  x = Math.floor(x);
  y = Math.floor(y);
  if (x < 0 || x > map.size - 1 || y < 0 || y > map.size - 1) return -1;
  return map.wallGrid[y * map.size + x];
}

function getMapObject(x, y) {
  x = Math.floor(x);
  y = Math.floor(y);
  return map.objects[y * map.size + x];
}

function rotate(angle) {
  player.direction = (player.direction + angle + CIRCLE) % CIRCLE;
}

function drawColumns(player, map, objects) {
  var allObjects = [];
  for (var column = 0; column < resolution; column++) {
    var angle = fov * (column / resolution - 0.5);
    var ray = mapCast(player, player.direction + angle, range);
    var columnProps = drawColumn(column, ray, angle, map);
    //  console.log(angle, ray, columnProps);

    //allObjects.push(columnProps);
  }
  //  drawSprites(player, map, allObjects);
};

function drawSky(direction, sky, ambient) {
  var skywidth = width * (CIRCLE / fov);
  var left = -skywidth * direction / CIRCLE;
  //console.log(width, left, width, height);
  // console.log(width);
  //  ctx.save();
  bmd.ctx.drawImage(sky.image, left, 0, skywidth, height);
  if (left < skywidth - width) {
    bmd.ctx.drawImage(sky.image, left + skywidth, 0, skywidth, height);
  }
  // if (ambient > 0) {
  //   drawRectangle(0, height * 0.5, width, height * 0.5, '#ffffff', ambient * 0.1);
  // }
  // ctx.restore();
};

function Bitmap(src, width, height) {
  image = new Image();
  image.src = src;
  width = width;
  height = height;
}

function drawColumn(column, ray, angle, map) {
  wallTexture = map.wallTexture,
    floorTexture = map.floorTexture,
    left = Math.floor(column * spacing),
    columnwidth = Math.ceil(spacing),
    hit = -1,
    objects = [],
    hitDistance;
  while (++hit < ray.length && ray[hit].height <= 0);

  for (var s = ray.length - 1; s >= 0; s--) {
    var step = ray[s];
    var rainDrops = Math.pow(Math.random(), 3) * s;
    var rain = (rainDrops > 0) && project(0.1, angle, step.distance),
      textureX, wall;

    if (s === hit) {
      textureX = Math.floor(wallTexture.width * step.offset);
      wall = project(step.height, angle, step.distance);
      var rect = new Phaser.Rectangle(textureX, 0, 1, wallTexture.height);
      //   console.log(rect);
      copyPixels2(map.wallTexture.image, rect, left, wall.top, columnwidth, wall.height);
      var alpha = Math.max((step.distance + step.shading) / lightRange - map.light, 0);
      drawRectangle(left, wall.top, columnwidth, wall.height, '#000000', alpha);
      hitDistance = step.distance;
    } else if (step.object) {

      objects.push({
        object: step.object,
        distance: step.distance,
        offset: step.offset,
        angle: angle
      });

    }

    // while (--rainDrops > 0) {
    //   drawRectangle(left, Math.random() * rain.top, 1, rain.height, '#ffffff', .15);
    // };
  }
  return {
    objects: objects,
    hit: hitDistance
  }
};

function drawRectangle(x, y, w, h, f, a) {
  bmd.ctx.beginPath();
  bmd.ctx.rect(x, y, w, h);
  bmd.ctx.fillStyle = f;
  bmd.ctx.globalAlpha = a;
  bmd.ctx.fill();
}

function project(height, angle, distance) {
  var z = distance * Math.cos(angle);
  var wallHeight = height * height / z;
  var bottom = height / 2 * (1 + 1 / z);
  return {
    top: bottom - wallHeight,
    height: wallHeight
  };
};

function mapCast(point, angle, range, objects) {
  var self = map,
    sin = Math.sin(angle),
    cos = Math.cos(angle),
    noWall = {
      length2: Infinity,
    };

  return ray({
    x: point.x,
    y: point.y,
    height: 0,
    distance: 0,
  });

  function ray(origin) {
    var stepX = step(sin, cos, origin.x, origin.y);
    var stepY = step(cos, sin, origin.y, origin.x, true);
    var nextStep =
      stepX.length2 < stepY.length2 ?
      inspect(stepX, 1, 0, origin.distance, stepX.y) :
      inspect(stepY, 0, 1, origin.distance, stepY.x);

    if (nextStep.distance > range) return [origin];
    return [origin].concat(ray(nextStep));
  }

  function step(rise, run, x, y, inverted) {
    if (run === 0) return noWall;
    var dx = run > 0 ? Math.floor(x + 1) - x : Math.ceil(x - 1) - x;
    var dy = dx * (rise / run);
    return {
      x: inverted ? y + dy : x + dx,
      y: inverted ? x + dx : y + dy,
      length2: dx * dx + dy * dy,
    };
  }

  function inspect(step, shiftX, shiftY, distance, offset) {
    var dx = cos < 0 ? shiftX : 0;
    var dy = sin < 0 ? shiftY : 0;
    step.height = getMapValue(step.x - dx, step.y - dy);
    step.distance = distance + Math.sqrt(step.length2);
    step.object = getMapObject(step.x - dx, step.y - dy);
    if (shiftX) step.shading = cos < 0 ? 2 : 0;
    else step.shading = sin < 0 ? 2 : 1;
    step.offset = offset - Math.floor(offset);
    return step;
  }
}

function updateMap(seconds) {
  if (map.light > 0) map.light = Math.max(map.light - 10 * seconds, 0);
  else if (Math.random() * 5 < seconds) map.light = 2;
}

function addObject(object, x, y) {
  map.objects.push(new MapObject(object, x, y));
}

function MapObject(object, x, y) {
  for (var prop in object) {
    map[prop] = object[prop];
  }
  map.x = x;
  map.y = y;
}

function update() {
  //  bmd.clear();
  drawSky(player.direction, map.skybox, map.light);
  var objects = [];
  drawColumns(player, map, objects);
  if (game.cursors.left.isDown)
    player.state = states.left;
  else if (game.cursors.right.isDown)
    player.state = states.right;
  else if (game.cursors.up.isDown)
    player.state = states.forward;
  else if (game.cursors.down.isDown)
    player.state = states.backward;
}


function render() {
  // if (!startGame) {
  //   mainMenuUpdate();
  //   return;
  // }
  // game.debug.box2dWorld();
}