/*eslint no-unused-vars: 0*/

Array.prototype.duplicates = function(returnDuplicated = false) {
  if (returnDuplicated) {
    return this.reduce(function(acc, e, i, arr) {
      if (arr.indexOf(e) !== i && acc.indexOf(e) < 0) {
        acc.push(e);
      }
      return acc;
    }, []);
  } else {
    return this.filter((e, i, arr) => {
      return arr.indexOf(e) == i;
    });
  }
};

$.div = function(klass, id = false) {
  return $(`<div ${id ? "id" : "class"}="${klass}"></div>`);
};

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
  this.source.InProcess = true;

  const target = { x: this.x, y: this.y };
  const field = this.source.field;
  const tiles = this.source.tiles;
  const processed = [];
  let sequence = [target];

  do {
    const tile = sequence.pop();
    sequence = sequence.concat(getAdjacent(tile, processed, this.value, field));
    if (hasNoPointDuplicates(tile, processed)) {
      processed.push(tile);
    }
  } while (sequence.length > 0);

  const anim = [];
  if (processed.length == 1) {
    shakeTile(this.dom).done(() => {
      this.source.InProcess = false;
    });
  } else {
    processed.forEach(e => {
      field[e.y][e.x] = 0;
      anim.push(tiles[e.y][e.x].dom.velocity({ opacity: 0 }, 400));
    });

    $.when.apply($, anim).done(() => {
      processed.forEach(e => {
        tiles[e.y][e.x].dom.remove();
        tiles[e.y][e.x] = null;
      });

      dropTiles(
        processed.length,
        processed
          .map(e => {
            return e.x;
          })
          .duplicates(),
        this.source
      );
    });
  }
}

function dropTiles(burned, empty, gameField) {
  const anim = [];
  const field = gameField.field;
  const tiles = gameField.tiles;

  empty.forEach(col => {
    let holes = 0;
    for (let i = field.length - 1; i >= 0; i--) {
      if (field[i][col] == 0) {
        holes++;
      } else {
        if (holes > 0) {
          const tile = tiles[i][col];
          anim.push(
            tile.dom.velocity({ top: `+=${gameField.tileHeight * holes}` }, 700)
          );
          [field[i][col], field[i + holes][col]] = [
            field[i + holes][col],
            field[i][col]
          ];
          [tiles[i][col], tiles[i + holes][col]] = [
            tiles[i + holes][col],
            tiles[i][col]
          ];
        }
      }
    }
    for (let j = 0; j < holes; j++) {
      const newValue = getRandomInt(gameField.tileColorsTotal, 1);
      const y = holes - j - 1;

      const tile = gameField.add({ x: col, y, value: newValue });

      gameField.tiles[y][col] = tile;
      gameField.field[y][col] = newValue;

      gameField.dom.append(tile.dom);
      tile.dom.css(
        "top",
        gameField.topBoundary + -gameField.tileHeight * (j + 1)
      );
      anim.push(
        tile.dom.velocity({ top: `+=${gameField.tileHeight * holes}` }, 700)
      );
    }
  });

  $.when.apply($, anim).done(() => {
    setScore(burned, gameField);
    gameField.update();
  });
}

function setScore(burned, gameField) {
  const anim = [];
  const predict = gameState.globalScore + burned * (burned >= 5 ? 15 : 10);
  anim.push(mineralCounter(gameState.globalScore, predict));

  const percents = (predict * 100) / gameState.scoreGoal;
  let width = (percents * 1245) / 100;
  if (width > 1245) {
    width = 1245;
  }
  anim.push(gameState.scoreProgressBar.velocity({ width: width }, 700));

  $.when.apply($, anim).done(() => {
    gameState.globalScore = predict;
    gameState.movesLeft--;
    if (gameState.globalScore >= gameState.scoreGoal) {
      alert("YOU WIN!!! :)");
    } else {
      if (gameState.movesLeft > 0) {
        gameField.InProcess = false;
      } else {
        alert("YOU LOSE!!! :(");
      }
    }
  });
}

function mineralCounter(start, finish, ms = 20) {
  const dfd = $.Deferred();

  const interval = count => {
    gameState.scoreTextField.html(count);
    if (count < finish) {
      setTimeout(() => interval(++count), ms);
    } else dfd.resolve();
  };
  interval(start);

  return dfd.promise();
}

function shakeTile(dom) {
  return dom
    .velocity({ left: "-=20" }, 100)
    .velocity({ left: "+=40" }, 100)
    .velocity({ left: "-=40" }, 100)
    .velocity({ left: "+=40" }, 100)
    .velocity({ left: "-=20" }, 100)
    .promise();
}
