import allBlocks from './blocks.js';

const grid = document.querySelector('.grid');
const gridWidth = 10;
//create grid and fill with squares

for (let i = 0; i < 200; i++) {
    const square = document.createElement('div');
    square.classList.add('square');
    grid.appendChild(square);
}

const playArea = Array.from(document.querySelectorAll('.square'));
console.log(playArea);

const position = 3;

const randomBlock = Math.floor(Math.random() * allBlocks.length);
console.log('randomBlock', randomBlock);

const activeBlock = allBlocks[randomBlock][0];

console.log('currentBlock', activeBlock);

function createBlock() {
    activeBlock.forEach(blockSquareLocation => {
        console.log(blockSquareLocation);
        playArea[position + blockSquareLocation].classList.add('block');
    });
}

function clearBlock() {
    activeBlock.forEach(blockSquareLocation => {
        playArea[position + blockSquareLocation].classList.remove('block');
    });
}

createBlock();

setTimeout(clearBlock, 2000);
