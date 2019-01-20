document.addEventListener("DOMContentLoaded", ready);

function ready() {
  const width = 5;
  const height = 5;

  const gameField = new Field({
    width,
    height,
    func: { onTileClick: onTileClick }
  });
  gameField.fill();
  $("body").append(gameField.dom);
}
