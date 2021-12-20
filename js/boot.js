let title;
let startGame = false;
let maxxdaddy;
let level = 1;
let score = 0;
let lives = 3;
let scoreCaption;
let levelCaption;
let livesCaption;
var CIRCLE = Math.PI * 2;
var MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
var player;
var objects;
var map;
var resolution = MOBILE ? 160 : 320;
var fov = Math.PI * .4;
var range = MOBILE ? 8 : 14;
var graphics;
var graphics2;
var graphics3;
var sin;
var cos;
var knife;
var goo;
var mapHeight = 25;
var mapWidth = 25;
var maze = [];
var inventory = [{
  knife,
  goo
}];

//CONSTANTS
const mapBlockSize = 5, // Size of walls on the mini map
  wallSize = 64, // Size of walls in the game world
  fieldOfView = 66, // Field of view of the player (in degrees)
  screenWidth =1000, // Width of the viewport
  screenHeight = 400, // Height of the viewport
  angleBetweenRays = parseFloat(66 / 640), // Angle between casted rays
  movementStep = 3, // How much the player moves each step 10
  turningStep = 2, // How fast the player turns 2.5
  sprite = null,
  images = [],
  sprites3d = [];
  const mapOffsetX = 670,
    mapOffsetY = 0;
const states = {
  'still': 0,
  'left': 1,
  'right': 2,
  'forward': 3,
  'backward': 4,
  'running': 5
};
var context;
var ambient = 0;
function Player(x, y, direction, inventory) {
  this.x = x;
  this.y = y;
  this.direction = direction;
  this.maxStamina = 10;
  this.stamina = this.maxStamina;
  this.inventory = inventory;
  this.weapon = this.inventory[0];
  this.paces = 0;
  this.state = states.still;
}

// function Bitmap(src, width, height) {
//   this.image = new Image();
//   this.image.src = src;
//   this.width = width;
//   this.height = height;
// }

function Map(size, skybox, wallTexture, floorTexture) {
   this.size = size;
   this.wallGrid = new Uint8Array(size * size);
//   //this.skybox = new Bitmap(skyTexturePath, 4000, 1290);
//   // this.wallTexture = new Bitmap(wallTexturePath, 1024, 1024);
//   // this.floorTexture = new Bitmap(floorTexturePath, 391, 392);
   this.light = 0;
   this.objects = [];
}
// var bmd;
// var MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
// var player;
// var map;
// var resolution = MOBILE ? 160 : 320;
// var fov = Math.PI * .4;
// var range = MOBILE ? 8 : 14;
// var hitDistance = 0;
// var width = 1000;
// var height = 500;
// var spacing = width / resolution;
// var lightRange = 5;
// var scale = (width + height) / 1200;
// var CIRCLE = Math.PI * 2;

// //const wallTexturePath = '../assets/images/wall_texture.jpg';
// //const skyTexturePath = '../assets/images/deathvalley_panorama.jpg';
// ///const floorTexturePath = '../assets/images/floor_texture.jpg';
// const textureMap = {
//   1: 'wall'
// }