/*eslint no-unused-vars: 0*/

class Tile {
  constructor(opt) {
    if (opt.source == null) {
      opt.source = {};
    }

    this.x = opt.x;
    this.y = opt.y;
    this.value = opt.value;
    this.source = opt.source;
    this.dom = this.render();
  }

  render() {
    const div = $.div("tile")
      .addClass(`_${this.value}`)
      .css({
        left: this.source.leftBoundary + this.source.tileWidth * this.x,
        top: this.source.topBoundary + this.source.tileHeight * this.y
      });

    div.click(() => {
      if (!this.source.InProcess) {
        this.source.func.onTileClick.call(this);
      }
    });

    return div;
  }

  set({ x, y, value }) {
    this.x = x;
    this.y = y;
    this.value = value;

    this.dom[0].classList.replace(this.dom[0].classList[1], `_${value}`);

    return this;
  }
}

class Field {
  constructor(opt) {
    if (opt.width == null || opt.width < 1) {
      opt.width = 10;
    }
    if (opt.height == null || opt.height < 1) {
      opt.height = 10;
    }
    if (opt.func == null) {
      opt.func = {};
    }

    this.leftBoundary = 130 + 48;
    this.topBoundary = 170 + 267 + 40.5;
    this.tileWidth = 171;
    this.tileHeight = 192;

    this.InProcess = false;
    this.width = opt.width;
    this.height = opt.height;
    this.tileColorsTotal = 5;
    this.field = [...new Array(this.height)].map(() => {
      return new Array(this.width).fill(0);
    });
    this.tiles = [];
    this.func = opt.func;
    this.dom = this.render();
  }

  add({ x, y, value }) {
    return new Tile({
      x: x,
      y: y,
      value: value,
      source: this
    });
  }

  fill() {
    this.field.forEach((row, i) => {
      row.forEach((elem, j) => {
        this.field[i][j] = getRandomInt(this.tileColorsTotal, 1);
      });
    });

    return this.update();
  }

  render() {
    const wrapper = $.div("wrapper", true);

    this.field.forEach((row, i) => {
      const tileRow = [];

      row.forEach((elem, j) => {
        const tile = this.add({ x: j, y: i, value: elem });
        const div = tile.dom;
        tileRow.push(tile);
        wrapper.append(div);
      });

      this.tiles.push([...tileRow]);
    });

    return wrapper;
  }

  update() {
    this.tiles.forEach((row, i) => {
      row.forEach((tile, j) => {
        tile.set({ x: j, y: i, value: this.field[i][j] });
      });
    });
    return this;
  }
}
