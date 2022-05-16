import ViewportEditor from './src/viewport-editor';

let editor = new ViewportEditor(
  document.querySelector('#test'),
  { rowNum: 4, columnNum: 4 },
  [
    ['a', 'a', 'b', 'c'],
    ['a', 'a', 'd', 'e'],
    ['f', 'g', 'h', 'i'],
  ]
);

document.querySelector('#row').value = 4;
document.querySelector('#col').value = 4;
document.querySelector('#btn-apply').addEventListener(
  'click',
  () =>
    (editor = new ViewportEditor(document.querySelector('#test'), {
      rowNum: document.querySelector('#row').value,
      columnNum: document.querySelector('#col').value,
    }))
);
document
  .querySelector('#btn-combine')
  .addEventListener('click', () => editor.combine());
document
  .querySelector('#btn-split')
  .addEventListener('click', () => editor.split());
document.querySelector('#btn-view').addEventListener('click', () => {
  const viewPlace = document.querySelector('#view-place');
  viewPlace.innerHTML = '';
  const fragment = document.createDocumentFragment();
  const viewArr = editor.viewArr.flat().filter((item) => !item.beMerged);
  console.log(viewArr.length);
  for (const v of viewArr) {
    const div = document.createElement('div');
    div.style = `border: 1px solid black; grid-column: ${v.colStart + 1} / ${v.colEnd + 2}; grid-row: ${v.rowStart + 1} / ${v.rowEnd + 2}`;
    fragment.appendChild(div);
  }
  viewPlace.appendChild(fragment);
});
