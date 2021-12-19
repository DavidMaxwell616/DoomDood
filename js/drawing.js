// Basic drawing functions
var drawing = {
  // Clear the screen
  clear: function () {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  },
  // Get rgb() color string
  colorRgb: function (r, g, b) {
    return "rgb(" + r + ", " + g + ", " + b + ")";
  },
  // Get rgba() color string
  colorRgba: function (r, g, b, a) {
    return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
  },
  // Draws a circle
  circle: function (x, y, radius, color) {
    context.beginPath();
    context.fillStyle = color;
    context.arc(x, y, radius, 0, Math.PI * 2, true);
    context.fill();
    context.closePath();
  },
  // Draws a rectangle
  rectangle: function (x, y, width, height, color) {
    context.beginPath();
    context.fillStyle = color;
    //graphics.fillGradientStyle(0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 1);
    context.fillRect(x, y, width, height);
    context.closePath();
  },
  // Draws a line
  // Note: for some reason lineTo() and stroke() result in a semi-transparent line
  // If you want to be sure the line is of solid color, use lineRectangle() instead
  line: function (x, y, x2, y2, color) {
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x2, y2);
    context.strokeStyle = color;
    context.stroke();
    context.closePath();
  },
  lineRectangle: function (x, y, x2, y2, color) {
    drawing.rectangle(x, y, 1, y2 - y, color);
  },
  verticalGradientRectangle: function(x,y,w,h,c1,c2)
  {
    for (var i = 0; i < h/2; i++)
    {
        var c = Phaser.Color.interpolateColor(c1, c2, h/2, i);
        bmd.rect(x, y, w, y+2, Phaser.Color.getWebRGB(c));
        y += 2;
    }
},

};