document.addEventListener("DOMContentLoaded", ready);

function ready() {
  const width = 9;
  const height = 9;

  gameState = {
    scoreGoal: 1000,
    globalScore: 0,
    movesLeft: 21,
    scoreProgressBar: $("#progress_wrapper .progressbar"),
    scoreTextField: $("#score_wrapper .score")
  };

  const gameField = new Field({
    width,
    height,
    func: { onTileClick: onTileClick }
  });
  gameField.fill();
  $("body").append(gameField.dom);
}
