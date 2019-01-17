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
    const div = document.createElement("div");
    div.classList.add("tile", `_${this.value}`);
    div.style.left = 171 * this.x + "px";
    div.style.top = 192 * this.y + "px";

    div.onclick = () => {
      this.source.func.onTileClick.call(this);
    };

    return div;
  }

  set({ x, y, value }) {
    this.x = x;
    this.y = y;
    this.value = value;

    this.dom.classList.replace(this.dom.classList[1], `_${value}`);

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

  fill() {
    this.field.forEach((row, i) => {
      row.forEach((elem, j) => {
        this.field[i][j] = getRandomInt(this.tileColorsTotal, 1);
      });
    });

    return this.update();
  }

  render() {
    const wrapper = document.createElement("div");
    wrapper.id = "wrapper";

    this.field.forEach((row, i) => {
      const tileRow = [];

      row.forEach((elem, j) => {
        const tile = new Tile({
          x: j,
          y: i,
          value: elem,
          source: this
        });
        const div = tile.dom;
        tileRow.push(tile);
        wrapper.appendChild(div);
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
