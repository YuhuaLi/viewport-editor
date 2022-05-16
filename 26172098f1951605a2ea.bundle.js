/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./main.js":
/*!*****************!*\
  !*** ./main.js ***!
  \*****************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _src_viewport_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/viewport-editor */ \"./src/viewport-editor.js\");\n\r\n\r\nlet editor = new _src_viewport_editor__WEBPACK_IMPORTED_MODULE_0__[\"default\"](\r\n  document.querySelector('#test'),\r\n  { rowNum: 4, columnNum: 4 },\r\n  [\r\n    ['a', 'a', 'b', 'c'],\r\n    ['a', 'a', 'd', 'e'],\r\n    ['f', 'g', 'h', 'i'],\r\n  ]\r\n);\r\n\r\ndocument.querySelector('#row').value = 4;\r\ndocument.querySelector('#col').value = 4;\r\ndocument.querySelector('#btn-apply').addEventListener(\r\n  'click',\r\n  () =>\r\n    (editor = new _src_viewport_editor__WEBPACK_IMPORTED_MODULE_0__[\"default\"](document.querySelector('#test'), {\r\n      rowNum: document.querySelector('#row').value,\r\n      columnNum: document.querySelector('#col').value,\r\n    }))\r\n);\r\ndocument\r\n  .querySelector('#btn-combine')\r\n  .addEventListener('click', () => editor.combine());\r\ndocument\r\n  .querySelector('#btn-split')\r\n  .addEventListener('click', () => editor.split());\r\ndocument.querySelector('#btn-view').addEventListener('click', () => {\r\n  const viewPlace = document.querySelector('#view-place');\r\n  viewPlace.innerHTML = '';\r\n  const fragment = document.createDocumentFragment();\r\n  const viewArr = editor.viewArr.flat().filter((item) => !item.beMerged);\r\n  console.log(viewArr.length);\r\n  for (const v of viewArr) {\r\n    const div = document.createElement('div');\r\n    div.style = `border: 1px solid black; grid-column: ${v.colStart + 1} / ${v.colEnd + 2}; grid-row: ${v.rowStart + 1} / ${v.rowEnd + 2}`;\r\n    fragment.appendChild(div);\r\n  }\r\n  viewPlace.appendChild(fragment);\r\n});\r\n\n\n//# sourceURL=webpack://viewport-editor/./main.js?");

/***/ }),

/***/ "./src/view-item.js":
/*!**************************!*\
  !*** ./src/view-item.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ ViewItem)\n/* harmony export */ });\nclass ViewItem {\r\n  parent;\r\n  constructor(rowStart, colStart) {\r\n    this.rowStart = rowStart;\r\n    this.colStart = colStart;\r\n    this.rowEnd = this.rowStart;\r\n    this.colEnd = this.colStart;\r\n    this.isActive = false;\r\n  }\r\n\r\n  get beMerged() {\r\n    return !!this.parent;\r\n  }\r\n\r\n  get isCombined() {\r\n    return this.rowStart !== this.rowEnd || this.colStart !== this.colEnd;\r\n  }\r\n\r\n  getRect(wUnit, hUnit) {\r\n    return [\r\n      this.colStart * wUnit,\r\n      this.rowStart * hUnit,\r\n      (this.colEnd - this.colStart + 1) * wUnit,\r\n      (this.rowEnd - this.rowStart + 1) * hUnit,\r\n    ];\r\n  }\r\n}\r\n\n\n//# sourceURL=webpack://viewport-editor/./src/view-item.js?");

/***/ }),

/***/ "./src/viewport-editor.js":
/*!********************************!*\
  !*** ./src/viewport-editor.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ ViewportEditor)\n/* harmony export */ });\n/* harmony import */ var _view_item__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./view-item */ \"./src/view-item.js\");\n\r\n\r\nclass ViewportEditor {\r\n  isMouseDown = false;\r\n  mouseDownPos = { x: 0, y: 0 };\r\n  drawing = false;\r\n  rafId;\r\n\r\n  constructor(target, options, viewArr = []) {\r\n    this.target = target;\r\n    this.options = {\r\n      rowNum: 8,\r\n      columnNum: 8,\r\n      lineWidth: 1,\r\n      background: '#000000',\r\n      strokeStyle: '#ffffff',\r\n      fillStyle: '#000000',\r\n      activeStrokeStyle: '#ff0000',\r\n      activeFillStyle: '#0000ff80',\r\n      ...options,\r\n    };\r\n    this.viewArr = this.initViewArr(\r\n      this.options.rowNum,\r\n      this.options.columnNum,\r\n      viewArr\r\n    );\r\n    this.createEditor();\r\n    this.init();\r\n    this.drawGrid();\r\n    this.activeViewArr = [];\r\n  }\r\n\r\n  init() {\r\n    this.canvas.width = this.canvas.offsetWidth;\r\n    this.canvas.height = this.canvas.offsetHeight;\r\n    this.offscreen.width = this.canvas.offsetWidth;\r\n    this.offscreen.height = this.canvas.offsetHeight;\r\n    this.width = this.canvas.width;\r\n    this.height = this.canvas.height;\r\n    this.widthUnit = this.canvas.width / this.options.columnNum;\r\n    this.heightUnit = this.canvas.height / this.options.rowNum;\r\n    this.canvas.style.width = `${this.width}px`;\r\n    this.canvas.style.height = `${this.height}px`;\r\n    this.offscreen.style.width = `${this.width}px`;\r\n    this.offscreen.style.height = `${this.height}px`;\r\n    this.ctx = this.canvas.getContext('2d');\r\n    this.offCtx = this.offscreen.getContext('2d');\r\n    this.ctx.lineWidth = this.options.lineWidth;\r\n    this.offCtx.lineWidth = this.options.lineWidth;\r\n    this.ctx.strokeStyle = this.options.strokeStyle;\r\n    this.offCtx.strokeStyle = this.options.strokeStyle;\r\n    this.ctx.fillStyle = this.options.fillStyle;\r\n    this.offCtx.fillStyle = this.options.fillStyle;\r\n    this.canvas.addEventListener('mousedown', this.onMouseDown);\r\n    this.canvas.addEventListener('mousemove', this.onMouseMove);\r\n    document.addEventListener('mouseup', this.onMouseUp);\r\n    // this.canvas.addEventListener('mouseleave', this.onMouseUp);\r\n\r\n    this.ctx.textAlign = 'center';\r\n    this.ctx.textBaseline = 'middle';\r\n  }\r\n\r\n  createEditor() {\r\n    const wrapper = document.createElement('div');\r\n    this.setStyle(wrapper, {\r\n      position: 'relative',\r\n      width: '100%',\r\n      height: '100%',\r\n    });\r\n\r\n    const canvas = document.createElement('canvas');\r\n    this.setStyle(canvas, {\r\n      position: 'absolute',\r\n      top: 0,\r\n      left: 0,\r\n      right: 0,\r\n      bottom: 0,\r\n      width: '100%',\r\n      height: '100%',\r\n      cursor: 'cell',\r\n    });\r\n\r\n    const offscreen = document.createElement('canvas');\r\n    this.setStyle(offscreen, {\r\n      position: 'absolute',\r\n      top: 0,\r\n      left: 0,\r\n      right: 0,\r\n      bottom: 0,\r\n      width: '100%',\r\n      height: '100%',\r\n      'pointer-events': 'none',\r\n    });\r\n\r\n    wrapper.appendChild(canvas);\r\n    wrapper.appendChild(offscreen);\r\n\r\n    this.target.firstElementChild?.remove();\r\n    this.target.appendChild(wrapper);\r\n    this.canvas = canvas;\r\n    this.offscreen = offscreen;\r\n  }\r\n\r\n  initViewArr(rowNum, colNum, arr) {\r\n    const viewArr = Array.from({ length: rowNum }).map((item, idx) =>\r\n      Array.from({ length: colNum }).map((v, i) => `${idx} -${i}`)\r\n    );\r\n    for (let i = 0; i < viewArr.length; i++) {\r\n      viewArr[i].splice(\r\n        0,\r\n        Math.min(colNum, arr[i]?.length || 0),\r\n        ...(arr[i]?.slice(0, colNum) || [])\r\n      );\r\n    }\r\n    const views = Array.from({ length: rowNum }).map(() => []);\r\n    const map = new Map();\r\n    for (let i = 0; i < viewArr.length; i++) {\r\n      for (let j = 0; j < viewArr[0].length; j++) {\r\n        const viewItem = new _view_item__WEBPACK_IMPORTED_MODULE_0__[\"default\"](i, j);\r\n        if (!map.has(viewArr[i][j])) {\r\n          map.set(viewArr[i][j], viewItem);\r\n        } else {\r\n          const parent = map.get(viewArr[i][j]);\r\n          parent.rowEnd = Math.max(i, parent.rowEnd);\r\n          parent.colEnd = Math.max(j, parent.colEnd);\r\n          viewItem.parent = parent;\r\n        }\r\n        views[i].push(viewItem);\r\n      }\r\n    }\r\n    return views;\r\n  }\r\n\r\n  setStyle(elem, styleObj) {\r\n    for (const prop in styleObj) {\r\n      elem.style[prop] = `${styleObj[prop]}`;\r\n    }\r\n  }\r\n\r\n  drawGrid() {\r\n    this.clearRect(this.ctx);\r\n    this.ctx.save();\r\n    this.ctx.fillStyle = this.options.background;\r\n    this.ctx.fillRect(0, 0, this.width, this.height);\r\n    this.ctx.restore();\r\n\r\n    for (let i = 0; i < this.viewArr.length; i++) {\r\n      for (let j = 0; j < this.viewArr[0].length; j++) {\r\n        this.drawViewItem(this.viewArr[i][j]);\r\n      }\r\n    }\r\n  }\r\n\r\n  drawViewItem(viewItem) {\r\n    if (viewItem.beMerged) {\r\n      return;\r\n    }\r\n    const rect = viewItem.getRect(this.widthUnit, this.heightUnit);\r\n    this.ctx.fillRect(...rect);\r\n    this.ctx.strokeRect(...rect);\r\n    // const [x, y, w, h] = rect;\r\n    // this.ctx.strokeText(\r\n    //   `${viewItem.rowStart}-${viewItem.colStart}`,\r\n    //   x + w / 2,\r\n    //   y + h / 2\r\n    // );\r\n  }\r\n\r\n  drawSelectRange(rect) {\r\n    this.clearRect(this.offCtx);\r\n    this.offCtx.save();\r\n    this.offCtx.strokeStyle = this.options.activeStrokeStyle;\r\n    this.offCtx.fillStyle = this.options.activeFillStyle;\r\n    this.offCtx.fillRect(...rect);\r\n    this.offCtx.strokeRect(...rect);\r\n    this.offCtx.restore();\r\n  }\r\n\r\n  setViewItemActive(viewItems) {\r\n    this.clearRect(this.offCtx);\r\n    this.offCtx.save();\r\n    this.offCtx.strokeStyle = this.options.activeStrokeStyle;\r\n    this.offCtx.fillStyle = this.options.activeFillStyle;\r\n    for (const viewItem of viewItems) {\r\n      if (viewItem.beMerged) continue;\r\n      const rect = viewItem.getRect(this.widthUnit, this.heightUnit);\r\n      this.offCtx.fillRect(...rect);\r\n      this.offCtx.strokeRect(...rect);\r\n    }\r\n    this.offCtx.restore();\r\n  }\r\n\r\n  onMouseDown = (event) => {\r\n    event.preventDefault();\r\n    event.stopPropagation();\r\n    const { offsetX, offsetY } = event;\r\n    this.mouseDownPos = { x: offsetX, y: offsetY };\r\n    this.isMouseDown = true;\r\n    const col = Math.floor(offsetX / this.widthUnit);\r\n    const row = Math.floor(offsetY / this.heightUnit);\r\n    const viewItem = this.viewArr[row][col].beMerged\r\n      ? this.viewArr[row][col].parent\r\n      : this.viewArr[row][col];\r\n    this.activeViewArr.splice(0, this.activeViewArr.length, viewItem);\r\n    this.setViewItemActive(this.activeViewArr);\r\n  };\r\n\r\n  onMouseMove = (event) => {\r\n    event.preventDefault();\r\n    event.stopPropagation();\r\n    if (!this.isMouseDown || this.drawing) return;\r\n    this.rafId = requestAnimationFrame(() => {\r\n      const { offsetX, offsetY } = event;\r\n      let left = Math.floor(\r\n        Math.min(offsetX, this.mouseDownPos.x) / this.widthUnit\r\n      );\r\n      let right = Math.floor(\r\n        Math.max(offsetX, this.mouseDownPos.x) / this.widthUnit\r\n      );\r\n      let top = Math.floor(\r\n        Math.floor(Math.min(offsetY, this.mouseDownPos.y) / this.heightUnit)\r\n      );\r\n      let bottom = Math.floor(\r\n        Math.floor(Math.max(offsetY, this.mouseDownPos.y) / this.heightUnit)\r\n      );\r\n      let [t, r, b, l] = [top, right, bottom, left];\r\n      let arr = this.viewArr\r\n        .slice(top, bottom + 1)\r\n        .map((item) => item.slice(left, right + 1))\r\n        .flat();\r\n      for (let viewItem of arr) {\r\n        const item = viewItem.beMerged ? viewItem.parent : viewItem;\r\n        l = Math.min(item.colStart, l);\r\n        t = Math.min(item.rowStart, t);\r\n        r = Math.max(item.colEnd, r);\r\n        b = Math.max(item.rowEnd, b);\r\n      }\r\n      while (t !== top || r !== right || b !== bottom || l !== left) {\r\n        arr = [];\r\n        for (let i = l; i < left; i++) {\r\n          for (let j = t; j <= bottom; j++) {\r\n            arr.push(\r\n              this.viewArr[j][i].beMerged\r\n                ? this.viewArr[j][i].parent\r\n                : this.viewArr[j][i]\r\n            );\r\n          }\r\n        }\r\n        for (let i = t; i < top; i++) {\r\n          for (let j = left; j <= r; j++) {\r\n            arr.push(\r\n              this.viewArr[i][j].beMerged\r\n                ? this.viewArr[i][j].parent\r\n                : this.viewArr[i][j]\r\n            );\r\n          }\r\n        }\r\n        for (let i = top; i <= b; i++) {\r\n          for (let j = r; j > right; j--) {\r\n            arr.push(\r\n              this.viewArr[i][j].beMerged\r\n                ? this.viewArr[i][j].parent\r\n                : this.viewArr[i][j]\r\n            );\r\n          }\r\n        }\r\n        for (let i = b; i > bottom; i--) {\r\n          for (let j = l; j <= right; j++) {\r\n            arr.push(\r\n              this.viewArr[i][j].beMerged\r\n                ? this.viewArr[i][j].parent\r\n                : this.viewArr[i][j]\r\n            );\r\n          }\r\n        }\r\n        [top, right, bottom, left] = [t, r, b, l];\r\n        for (let viewItem of arr) {\r\n          const item = viewItem.beMerged ? viewItem.parent : viewItem;\r\n          l = Math.min(item.colStart, l);\r\n          t = Math.min(item.rowStart, t);\r\n          r = Math.max(item.colEnd, r);\r\n          b = Math.max(item.rowEnd, b);\r\n        }\r\n      }\r\n      arr = this.viewArr\r\n        .slice(top, bottom + 1)\r\n        .map((item) => item.slice(left, right + 1))\r\n        .flat();\r\n      this.activeViewArr.splice(0, this.activeViewArr.length, ...arr);\r\n      this.setViewItemActive(this.activeViewArr);\r\n      this.drawing = false;\r\n    });\r\n    this.drawing = true;\r\n  };\r\n\r\n  onMouseUp = (event) => {\r\n    if (!this.isMouseDown) return;\r\n    this.isMouseDown = false;\r\n    cancelAnimationFrame(this.rafId);\r\n    this.drawing = false;\r\n  };\r\n\r\n  clearRect(ctx) {\r\n    ctx.clearRect(0, 0, this.width, this.height);\r\n  }\r\n\r\n  calcRect(x1, y1, x2, y2) {\r\n    const x = Math.min(x1, x2);\r\n    const y = Math.min(y1, y2);\r\n    const width = Math.abs(x2 - x1);\r\n    const height = Math.abs(y2 - y1);\r\n    return [x, y, width, height];\r\n  }\r\n\r\n  combine() {\r\n    let minRow = Infinity;\r\n    let minCol = Infinity;\r\n    let maxRow = 0;\r\n    let maxCol = 0;\r\n    let item = null;\r\n    for (const viewItem of this.activeViewArr) {\r\n      if (viewItem.rowStart < minRow || viewItem.colStart < minCol) {\r\n        minRow = viewItem.rowStart;\r\n        minCol = viewItem.colStart;\r\n        item = viewItem;\r\n      }\r\n      if (viewItem.rowEnd > maxRow || viewItem.colEnd > maxCol) {\r\n        maxRow = viewItem.rowEnd;\r\n        maxCol = viewItem.colEnd;\r\n      }\r\n    }\r\n    if (item) {\r\n      item.rowEnd = maxRow;\r\n      item.colEnd = maxCol;\r\n      this.activeViewArr.forEach((viewItem) => {\r\n        if (item !== viewItem) {\r\n          viewItem.rowEnd = viewItem.rowStart;\r\n          viewItem.colEnd = viewItem.colStart;\r\n          viewItem.parent = item;\r\n        }\r\n      });\r\n      this.activeViewArr.splice(0, this.activeViewArr.length, item);\r\n      this.setViewItemActive(this.activeViewArr);\r\n    }\r\n    this.drawGrid();\r\n  }\r\n\r\n  split() {\r\n    const newActive = [];\r\n    this.activeViewArr.forEach((item) => {\r\n      if (item.isCombined) {\r\n        const arr = this.viewArr\r\n          .slice(item.rowStart, item.rowEnd + 1)\r\n          .map((v) => v.slice(item.colStart, item.colEnd + 1))\r\n          .flat();\r\n        arr.forEach((v) => {\r\n          newActive.push(v);\r\n        });\r\n      } else if (!item.beMerged && !newActive.includes(item)) {\r\n        newActive.push(item);\r\n      }\r\n      item.rowEnd = item.rowStart;\r\n      item.colEnd = item.colStart;\r\n    });\r\n    newActive.forEach((item) => (item.parent = null));\r\n    this.activeViewArr.splice(0, this.activeViewArr.length, ...newActive);\r\n    this.setViewItemActive(this.activeViewArr);\r\n    this.drawGrid();\r\n  }\r\n}\r\n\n\n//# sourceURL=webpack://viewport-editor/./src/viewport-editor.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./main.js");
/******/ 	
/******/ })()
;