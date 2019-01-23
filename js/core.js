document.addEventListener("DOMContentLoaded", ready);

function ready() {
  const width = 9;
  const height = 9;

  gameState = {
    scoreGoal: 1000,
    globalScore: 0,
    movesLeft: 21,
    scoreProgressBar: $("#progress_wrapper .progressbar"),
    scoreTextField: $("#gamestuff .score"),
    movesTextField: $("#gamestuff .moves"),
    popup: {
      body: $("#popup"),
      text: $("#popup .text"),
      button: $("#popup .button")
    },
    wall: $("#wall")
  };
  gameState.movesTextField.html(gameState.movesLeft);
  gameState.popup.button.click(() => {
    hidePopup();
  });

  const gameField = new Field({
    width,
    height,
    func: { onTileClick: onTileClick }
  });

  scaleGame();
  gameField.fill();
  showPopup();
}
