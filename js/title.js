function mainMenuCreate() {
  title = game.add.image(0, 0, 'title');

  title.width = game.width;
  title.height = game.height;
  title.visible = true;
  game.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}


function mainMenuUpdate() {
  if (game.spaceKey.isDown) {
    game.spaceKey = null;
    title.visible = false;
    gameCreate();
    startGame = true;
  }
}