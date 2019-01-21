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
    movesTextField: $("#gamestuff .moves")
  };

  gameState.movesTextField.html(gameState.movesLeft);

  const gameField = new Field({
    width,
    height,
    func: { onTileClick: onTileClick }
  });
  gameField.fill();
}
