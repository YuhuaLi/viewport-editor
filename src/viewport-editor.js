import ViewItem from './view-item';

export default class ViewportEditor {
  isMouseDown = false;
  mouseDownPos = { x: 0, y: 0 };
  drawing = false;
  rafId;

  constructor(target, options, viewArr = []) {
    this.target = target;
    this.options = {
      rowNum: 8,
      columnNum: 8,
      lineWidth: 1,
      background: '#000000',
      strokeStyle: '#ffffff',
      fillStyle: '#000000',
      activeStrokeStyle: '#ff0000',
      activeFillStyle: '#0000ff80',
      ...options,
    };
    this.viewArr = this.initViewArr(
      this.options.rowNum,
      this.options.columnNum,
      viewArr
    );
    this.createEditor();
    this.init();
    this.drawGrid();
    this.activeViewArr = [];
  }

  init() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.offscreen.width = this.canvas.offsetWidth;
    this.offscreen.height = this.canvas.offsetHeight;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.widthUnit = this.canvas.width / this.options.columnNum;
    this.heightUnit = this.canvas.height / this.options.rowNum;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.offscreen.style.width = `${this.width}px`;
    this.offscreen.style.height = `${this.height}px`;
    this.ctx = this.canvas.getContext('2d');
    this.offCtx = this.offscreen.getContext('2d');
    this.ctx.lineWidth = this.options.lineWidth;
    this.offCtx.lineWidth = this.options.lineWidth;
    this.ctx.strokeStyle = this.options.strokeStyle;
    this.offCtx.strokeStyle = this.options.strokeStyle;
    this.ctx.fillStyle = this.options.fillStyle;
    this.offCtx.fillStyle = this.options.fillStyle;
    this.canvas.addEventListener('mousedown', this.onMouseDown);
    this.canvas.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
    // this.canvas.addEventListener('mouseleave', this.onMouseUp);

    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
  }

  createEditor() {
    const wrapper = document.createElement('div');
    this.setStyle(wrapper, {
      position: 'relative',
      width: '100%',
      height: '100%',
    });

    const canvas = document.createElement('canvas');
    this.setStyle(canvas, {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      cursor: 'cell',
    });

    const offscreen = document.createElement('canvas');
    this.setStyle(offscreen, {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      'pointer-events': 'none',
    });

    wrapper.appendChild(canvas);
    wrapper.appendChild(offscreen);

    this.target.firstElementChild?.remove();
    this.target.appendChild(wrapper);
    this.canvas = canvas;
    this.offscreen = offscreen;
  }

  initViewArr(rowNum, colNum, arr) {
    const viewArr = Array.from({ length: rowNum }).map((item, idx) =>
      Array.from({ length: colNum }).map((v, i) => `${idx} -${i}`)
    );
    for (let i = 0; i < viewArr.length; i++) {
      viewArr[i].splice(
        0,
        Math.min(colNum, arr[i]?.length || 0),
        ...(arr[i]?.slice(0, colNum) || [])
      );
    }
    const views = Array.from({ length: rowNum }).map(() => []);
    const map = new Map();
    for (let i = 0; i < viewArr.length; i++) {
      for (let j = 0; j < viewArr[0].length; j++) {
        const viewItem = new ViewItem(i, j);
        if (!map.has(viewArr[i][j])) {
          map.set(viewArr[i][j], viewItem);
        } else {
          const parent = map.get(viewArr[i][j]);
          parent.rowEnd = Math.max(i, parent.rowEnd);
          parent.colEnd = Math.max(j, parent.colEnd);
          viewItem.parent = parent;
        }
        views[i].push(viewItem);
      }
    }
    return views;
  }

  setStyle(elem, styleObj) {
    for (const prop in styleObj) {
      elem.style[prop] = `${styleObj[prop]}`;
    }
  }

  drawGrid() {
    this.clearRect(this.ctx);
    this.ctx.save();
    this.ctx.fillStyle = this.options.background;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.restore();

    for (let i = 0; i < this.viewArr.length; i++) {
      for (let j = 0; j < this.viewArr[0].length; j++) {
        this.drawViewItem(this.viewArr[i][j]);
      }
    }
  }

  drawViewItem(viewItem) {
    if (viewItem.beMerged) {
      return;
    }
    const rect = viewItem.getRect(this.widthUnit, this.heightUnit);
    this.ctx.fillRect(...rect);
    this.ctx.strokeRect(...rect);
    // const [x, y, w, h] = rect;
    // this.ctx.strokeText(
    //   `${viewItem.rowStart}-${viewItem.colStart}`,
    //   x + w / 2,
    //   y + h / 2
    // );
  }

  drawSelectRange(rect) {
    this.clearRect(this.offCtx);
    this.offCtx.save();
    this.offCtx.strokeStyle = this.options.activeStrokeStyle;
    this.offCtx.fillStyle = this.options.activeFillStyle;
    this.offCtx.fillRect(...rect);
    this.offCtx.strokeRect(...rect);
    this.offCtx.restore();
  }

  setViewItemActive(viewItems) {
    this.clearRect(this.offCtx);
    this.offCtx.save();
    this.offCtx.strokeStyle = this.options.activeStrokeStyle;
    this.offCtx.fillStyle = this.options.activeFillStyle;
    for (const viewItem of viewItems) {
      if (viewItem.beMerged) continue;
      const rect = viewItem.getRect(this.widthUnit, this.heightUnit);
      this.offCtx.fillRect(...rect);
      this.offCtx.strokeRect(...rect);
    }
    this.offCtx.restore();
  }

  onMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const { offsetX, offsetY } = event;
    this.mouseDownPos = { x: offsetX, y: offsetY };
    this.isMouseDown = true;
    const col = Math.floor(offsetX / this.widthUnit);
    const row = Math.floor(offsetY / this.heightUnit);
    const viewItem = this.viewArr[row][col].beMerged
      ? this.viewArr[row][col].parent
      : this.viewArr[row][col];
    this.activeViewArr.splice(0, this.activeViewArr.length, viewItem);
    this.setViewItemActive(this.activeViewArr);
  };

  onMouseMove = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!this.isMouseDown || this.drawing) return;
    this.rafId = requestAnimationFrame(() => {
      const { offsetX, offsetY } = event;
      let left = Math.floor(
        Math.min(offsetX, this.mouseDownPos.x) / this.widthUnit
      );
      let right = Math.floor(
        Math.max(offsetX, this.mouseDownPos.x) / this.widthUnit
      );
      let top = Math.floor(
        Math.floor(Math.min(offsetY, this.mouseDownPos.y) / this.heightUnit)
      );
      let bottom = Math.floor(
        Math.floor(Math.max(offsetY, this.mouseDownPos.y) / this.heightUnit)
      );
      let [t, r, b, l] = [top, right, bottom, left];
      let arr = this.viewArr
        .slice(top, bottom + 1)
        .map((item) => item.slice(left, right + 1))
        .flat();
      for (let viewItem of arr) {
        const item = viewItem.beMerged ? viewItem.parent : viewItem;
        l = Math.min(item.colStart, l);
        t = Math.min(item.rowStart, t);
        r = Math.max(item.colEnd, r);
        b = Math.max(item.rowEnd, b);
      }
      while (t !== top || r !== right || b !== bottom || l !== left) {
        arr = [];
        for (let i = l; i < left; i++) {
          for (let j = t; j <= bottom; j++) {
            arr.push(
              this.viewArr[j][i].beMerged
                ? this.viewArr[j][i].parent
                : this.viewArr[j][i]
            );
          }
        }
        for (let i = t; i < top; i++) {
          for (let j = left; j <= r; j++) {
            arr.push(
              this.viewArr[i][j].beMerged
                ? this.viewArr[i][j].parent
                : this.viewArr[i][j]
            );
          }
        }
        for (let i = top; i <= b; i++) {
          for (let j = r; j > right; j--) {
            arr.push(
              this.viewArr[i][j].beMerged
                ? this.viewArr[i][j].parent
                : this.viewArr[i][j]
            );
          }
        }
        for (let i = b; i > bottom; i--) {
          for (let j = l; j <= right; j++) {
            arr.push(
              this.viewArr[i][j].beMerged
                ? this.viewArr[i][j].parent
                : this.viewArr[i][j]
            );
          }
        }
        [top, right, bottom, left] = [t, r, b, l];
        for (let viewItem of arr) {
          const item = viewItem.beMerged ? viewItem.parent : viewItem;
          l = Math.min(item.colStart, l);
          t = Math.min(item.rowStart, t);
          r = Math.max(item.colEnd, r);
          b = Math.max(item.rowEnd, b);
        }
      }
      arr = this.viewArr
        .slice(top, bottom + 1)
        .map((item) => item.slice(left, right + 1))
        .flat();
      this.activeViewArr.splice(0, this.activeViewArr.length, ...arr);
      this.setViewItemActive(this.activeViewArr);
      this.drawing = false;
    });
    this.drawing = true;
  };

  onMouseUp = (event) => {
    if (!this.isMouseDown) return;
    this.isMouseDown = false;
    cancelAnimationFrame(this.rafId);
    this.drawing = false;
  };

  clearRect(ctx) {
    ctx.clearRect(0, 0, this.width, this.height);
  }

  calcRect(x1, y1, x2, y2) {
    const x = Math.min(x1, x2);
    const y = Math.min(y1, y2);
    const width = Math.abs(x2 - x1);
    const height = Math.abs(y2 - y1);
    return [x, y, width, height];
  }

  combine() {
    let minRow = Infinity;
    let minCol = Infinity;
    let maxRow = 0;
    let maxCol = 0;
    let item = null;
    for (const viewItem of this.activeViewArr) {
      if (viewItem.rowStart < minRow || viewItem.colStart < minCol) {
        minRow = viewItem.rowStart;
        minCol = viewItem.colStart;
        item = viewItem;
      }
      if (viewItem.rowEnd > maxRow || viewItem.colEnd > maxCol) {
        maxRow = viewItem.rowEnd;
        maxCol = viewItem.colEnd;
      }
    }
    if (item) {
      item.rowEnd = maxRow;
      item.colEnd = maxCol;
      this.activeViewArr.forEach((viewItem) => {
        if (item !== viewItem) {
          viewItem.rowEnd = viewItem.rowStart;
          viewItem.colEnd = viewItem.colStart;
          viewItem.parent = item;
        }
      });
      this.activeViewArr.splice(0, this.activeViewArr.length, item);
      this.setViewItemActive(this.activeViewArr);
    }
    this.drawGrid();
  }

  split() {
    const newActive = [];
    this.activeViewArr.forEach((item) => {
      if (item.isCombined) {
        const arr = this.viewArr
          .slice(item.rowStart, item.rowEnd + 1)
          .map((v) => v.slice(item.colStart, item.colEnd + 1))
          .flat();
        arr.forEach((v) => {
          newActive.push(v);
        });
      } else if (!item.beMerged && !newActive.includes(item)) {
        newActive.push(item);
      }
      item.rowEnd = item.rowStart;
      item.colEnd = item.colStart;
    });
    newActive.forEach((item) => (item.parent = null));
    this.activeViewArr.splice(0, this.activeViewArr.length, ...newActive);
    this.setViewItemActive(this.activeViewArr);
    this.drawGrid();
  }
}
