/*eslint no-unused-vars: 0*/

function getRandomInt(max, min = 0) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function hasNoPointDuplicates({ x, y }, points) {
  return (
    points.filter(e => {
      return e.x == x && e.y == y;
    }).length == 0
  );
}

function getAdjacent(tile, old, value, field) {
  const adjacent = [];
  if (
    field[tile.y - 1] != null &&
    hasNoPointDuplicates({ x: tile.x, y: tile.y - 1 }, old) &&
    field[tile.y - 1][tile.x] == value
  ) {
    adjacent.push({ x: tile.x, y: tile.y - 1 });
  }
  if (
    field[tile.y] != null &&
    hasNoPointDuplicates({ x: tile.x + 1, y: tile.y }, old) &&
    field[tile.y][tile.x + 1] == value
  ) {
    adjacent.push({ x: tile.x + 1, y: tile.y });
  }
  if (
    field[tile.y + 1] != null &&
    hasNoPointDuplicates({ x: tile.x, y: tile.y + 1 }, old) &&
    field[tile.y + 1][tile.x] == value
  ) {
    adjacent.push({ x: tile.x, y: tile.y + 1 });
  }
  if (
    field[tile.y] != null &&
    hasNoPointDuplicates({ x: tile.x - 1, y: tile.y }, old) &&
    field[tile.y][tile.x - 1] == value
  ) {
    adjacent.push({ x: tile.x - 1, y: tile.y });
  }

  return adjacent;
}

function onTileClick() {
  const target = { x: this.x, y: this.y };
  const field = this.source.field;
  const processed = [];
  let sequence = [target];

  do {
    const tile = sequence.pop();
    sequence = sequence.concat(getAdjacent(tile, processed, this.value, field));
    if (hasNoPointDuplicates(tile, processed)) {
      processed.push(tile);
    }
  } while (sequence.length > 0);

  if (processed.length == 1) {
    shakeTile(this.dom);
  } else {
    processed.forEach(e => {
      this.source.field[e.y][e.x] = 0;
      Velocity(
        this.source.tiles[e.y][e.x].dom,
        { opacity: 0, display: "none" },
        { duration: 400 }
      );
    });
  }
}

function shakeTile(dom) {
  Velocity(dom, { left: dom.offsetLeft - 20 }, { duration: 150 });
  Velocity(dom, { left: dom.offsetLeft + 40 }, { duration: 150 });
  Velocity(dom, { left: dom.offsetLeft - 20 }, { duration: 150 });
  Velocity(dom, { left: dom.offsetLeft + 40 }, { duration: 150 });
  Velocity(dom, { left: dom.offsetLeft }, { duration: 150 });
}
