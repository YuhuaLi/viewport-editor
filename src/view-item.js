export default class ViewItem {
  parent;
  constructor(rowStart, colStart) {
    this.rowStart = rowStart;
    this.colStart = colStart;
    this.rowEnd = this.rowStart;
    this.colEnd = this.colStart;
    this.isActive = false;
  }

  get beMerged() {
    return !!this.parent;
  }

  get isCombined() {
    return this.rowStart !== this.rowEnd || this.colStart !== this.colEnd;
  }

  getRect(wUnit, hUnit) {
    return [
      this.colStart * wUnit,
      this.rowStart * hUnit,
      (this.colEnd - this.colStart + 1) * wUnit,
      (this.rowEnd - this.rowStart + 1) * hUnit,
    ];
  }
}
