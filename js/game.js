const game = new Phaser.Game(1000, 500, Phaser.CANVAS, 'game', {
  preload,
  create,
  update,
  render,
});


function create() {
//if (!startGame) mainMenuCreate();
//else
gameCreate();
}

function updateStats() {
  levelText.setText('LEVEL: ' + level);
  scoreText.setText('SCORE: ' + score);
  livesText.setText('LIVES: ' + lives);
}

function copyPixels2(a,b,c,d,e,f)
{
  "string"==typeof a&&(a=cache.getImage(a)),a&&
  context.drawImage(a,b.x,b.y,b.width,b.height,c,d,e,f);
}

function gameCreate() {
   player = new Player(15.3, -1.2, Math.PI * 0.3, inventory);
   map = new Map(32);
   map.wallGrid[15] = 1;
   map.wallGrid[17] = 1;

    map.wallGrid[15 + 32] = 1;
    map.wallGrid[16 + 32] = 1;
    map.wallGrid[17 + 32] = 1;
  // var objects = [];
  bmd = game.add.bitmapData(game.width, game.height);
  context = bmd.ctx;
  // // bmd.smoothed = false;
  map.sky = game.add.image(0, 0, 'sky');
  map.sky.width = 4000;
  map.sky.height = height;
  map.wallTexture = game.add.image(0, 0, 'wall');
  map.wallTexture.visible = false;
 //drawSky(player.direction, map.sky, map.light);
 //drawColumns(player, map, objects);
//   var bobX = Math.cos(player.paces * 2) * scale * 6;
//   var bobY = Math.sin(player.paces * 4) * scale * 6;
//   var left = width * 0.55 + bobX;
//   var top = height * 0.5 + bobY;
//   knife = add.sprite(left, top, 'knife_hand');
//   knife.width=320;
//   knife.height=320;
//   goo = add.sprite(0, 0, 'goo_hand');
//  // knife.visible = false;
//   goo.visible = false;
  //drawWeapon(player.weapon, player.paces);
  // drawMiniMap(map, player);
  cursors = game.input.keyboard.createCursorKeys();
  spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  levelText = game.add.text(game.width *.1, 5, 'Level: ' + level, {
    fill: '#ffffff',
    font: '14pt Arial',
  });
  scoreText = game.add.text(game.width*.45, 5, 'Score: ' + score, {
    fill: '#ffffff',
    font: '14pt Arial',
  });
  livesText = game.add.text(game.width *.8, 5, 'Lives: ' + lives, {
    fill: '#ffffff',
    font: '14pt Arial',
  });
 
 
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

function rotatePlayer(angle) {
  player.direction += (angle + CIRCLE) % CIRCLE;
//console.log(player.direction,angle);
}

function drawColumns(player, map, objects) {
  var allObjects = [];
  for (var column = 0; column < resolution; column++) {
    var angle = fov * (column / resolution - 0.5);
    var ray = mapCast(player, player.direction + angle, range);
    var columnProps = drawColumn(column, ray, angle, map);
 
    allObjects.push(columnProps);
  }
  //  drawSprites(player, map, allObjects);
};

function updateSky() {
  var width = game.width * (CIRCLE / fov);
  var left = -width * player.direction / CIRCLE;
  //sky.width=width;
  //sky.height=height;
  map.sky.x = left;  
  map.sky.width = width;
  console.log(ambient);
  if (left < game.width - width) 
       map.sky.x= left + width, 0;
  if (ambient > 0) {
    drawRectangle(0, game.height * 0.5, game.width, game.height * 0.5, '#ffffff', ambient * 0.1);
  }
};


function drawColumn(column, ray, angle, map) {
  wallTexture = map.wallTexture,
    floorTexture = map.floorTexture,
    left = Math.floor(column * spacing),
    width = Math.ceil(spacing),
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
 
      copyPixels2(map.wallTexture.image, rect, left, wall.top, width, wall.height);
      var alpha = Math.max((step.distance + step.shading) / lightRange - map.light, 0);
      drawRectangle(left, wall.top, width, wall.height, '#000000', alpha);
      hitDistance = step.distance;
    } else if (step.object) {

      objects.push({
        object: step.object,
        distance: step.distance,
        offset: step.offset,
        angle: angle
      });

    }

    while (--rainDrops > 0) {
      drawRectangle(left, Math.random() * rain.top, 1, rain.height, '#ffffff', .15);
    };
  }
  return {
    objects: objects,
    hit: hitDistance
  }
};

function drawRectangle(x, y, w, h, f, a) {
  context.beginPath();
  context.rect(x, y, w, h);
  context.fillStyle = f;
  context.globalAlpha = a;
  context.fill();
}

function project(height, angle, distance) {
  var z = distance * Math.cos(angle);
  var wallHeight = height * height / z;
  var bottom = height / 2 * (1 + 1 / z);
  return {
    top: bottom - wallHeight,
    height: wallHeight
  };
}

function mapCast(point, angle, range, objects) {
    self = map,
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
}

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


function drawWeapon(weapon, paces) {
  var bobX = Math.cos(paces * 2) * scale * 6;
  var bobY = Math.sin(paces * 4) * scale * 6;
  var left = width * 0.55 + bobX;
  var top = height * 0.6 + bobY;
  weapon.left = left;
  weapon.top = top;
  weapon.width = weapon.width * scale;
  weapon.height *= scale;;
}

function walk(distance, angle) {
  var dx = Math.cos(player.direction + angle) * distance;
  var dy = Math.sin(player.direction + angle) * distance;
  if (getMapValue(player.x + dx, player.y) <= 0) player.x += dx;
  if (getMapValue(player.x, player.y + dy) <= 0) player.y += dy;
  player.paces += distance;
};

function movePlayer() {
  var speed = player.running && player.stamina > 0 ? 3 : 1.5;
  var seconds = 1;
  if (player.state==states.forward) walk(speed * seconds, 0);
  if (player.state==states.backward) walk(-speed * seconds, 0);
  
  if (player.state==states.left) rotatePlayer(-Math.PI * seconds);;
  if (player.state==states.right) rotatePlayer(Math.PI * seconds);;

  if (player.state==states.running && player.stamina > -1) {
    player.stamina -= 0.1;
  } else if (player.stamina < 10) {
    player.stamina += 0.5;
  }
  var maxSpeed = 1000, // fastest possible mouse speed
  speed = Math.min(player.x, maxSpeed) / maxSpeed,
  amount = Math.PI * speed;

if (player.direction > CIRCLE) {
  amount -= CIRCLE;
} else if (player.direction < 0) {
  amount += CIRCLE;
}

player.direction += amount;

}

function cycleWeapons() {
  player.weapon =
    player.inventory[player.inventory.indexOf(player.weapon) + 1] ||
    player.inventory[0];
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
  // if (!startGame) {
  //   mainMenuUpdate();
  //   return;
  // }
  player.state = states.still;
  if (cursors.left.isDown)
     player.state = states.left;
   else if (cursors.right.isDown)
     player.state = states.right;
  else if (cursors.up.isDown)
    player.state = states.forward;
  else if (cursors.down.isDown)
    player.state = states.backward;
  if(player.state!=states.still)
    movePlayer();
  updateStats();
// context.clearRect(0, 0, context.canvas.width, context.canvas.height);;
updateSky();
 //  drawColumns(player, map, objects);
  // drawWeapon(player.weapon, player.paces);
  // drawMiniMap(map, player);
}


function render() {
  // if (!startGame) {
  //   mainMenuUpdate();
  //   return;
  // }
  // debug.box2dWorld();
}

function randomizeMap() {
  for (var i = 0; i < map.size * map.size; i++) {
    map.wallGrid[i] = Math.random() < 0.3 ? 1 : 0;
  }
}


function drawSpriteColumn(column, columnProps, sprites) {
  var left = Math.floor(column * spacing),
    width = Math.ceil(spacing),
    angle = fov * (column / resolution - 0.5),
    columnWidth = width / resolution;

  //todo: make rays check for objects, and return those that it actually hit

  //check if ray hit an object
  //if(!columnProps.objects.length){return;}

  sprites = sprites.filter(function (sprite) {
    return !columnProps.hit || sprite.distanceFromPlayer < columnProps.hit;
  });

  for (var i = 0; i < sprites.length; i++) {
    sprite = sprites[i];

    //mappedColumnObj = columnProps.objects.filter(function(obj){
    //	return sprite === obj.object;
    //})[0];

    //if(!mappedColumnObj)return;

    //determine if sprite should be drawn based on current column position and sprite width
    spriteIsInColumn =
      left > sprite.cameraXOffset - sprite.width / 2 &&
      left < sprite.cameraXOffset + sprite.width / 2;

 
    if (spriteIsInColumn) {
      textureX = Math.floor(
        (sprite.width / sprite.numColumns) * (column - sprite.firstColumn),
      );

      ctx.fillStyle = 'black';
      ctx.globalAlpha = 1;
      //ctx.fillRect(left, top , 10, sprite.height);

      var brightness =
        Math.max(sprite.distanceFromPlayer / lightRange - map.light, 0) *
        100;

      sprite.style.webkitFilter = 'brightness(' + brightness + '%)';
      sprite.style.filter = 'brightness(' + brightness + '%)';

      graphics.drawImage(
        sprite.image,
        textureX,
        0,
        1,
        sprite.height,
        left,
        sprite.top,
        width,
        sprite.height,
      );
    }
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