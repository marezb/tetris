import allBlocks from './blocks.js';

const grid = document.querySelector('.grid');

//create HTML grids and fill with divs
for (let i = 0; i < 200; i++) {
    const square = document.createElement('div');
    square.classList.add('square');
    square.classList.add('hidden');
    grid.appendChild(square);
}

//these divs we need to stop blocks at the bottom of the grid
for (let i = 1; i <= 10; i++) {
    const square = document.createElement('div');
    square.classList.add('full');
    square.classList.add('hidden');
    grid.appendChild(square);
}

//////////////////////////////////////////////////////

const gridWidth = 10;
const randomBlock = () => Math.floor(Math.random() * allBlocks.length);
let activeBlock = allBlocks[randomBlock()][0];
let position = 3;
const playArea = Array.from(document.querySelectorAll('.hidden'));

//////////////////////////////////////////////////////

function addClassToDiv(className) {
    activeBlock.forEach(blockSmallSquareLocation => {
        // console.log(blockSmallSquareLocation);
        playArea[position + blockSmallSquareLocation].classList.add(className);
    });
}

function createBlock() {
    addClassToDiv('block');
}

function clearBlock() {
    activeBlock.forEach(blockSquareLocation => {
        playArea[position + blockSquareLocation].classList.remove('block');
    });
}
createBlock();

function moveBlockDown() {
    clearBlock();
    position += gridWidth;
    console.log(position);
    createBlock();
    stopBlockMovement();
}

function checkIfBlockIsAtTheBottom(activeBlock) {
    return activeBlock.some(blockSmallSquareLocation =>
        playArea[position + blockSmallSquareLocation + gridWidth].classList.contains(
            'full'
        )
    );
}

function stopBlockMovement() {
    if (checkIfBlockIsAtTheBottom(activeBlock)) {
        console.log('jestesmy w ifie');
        addClassToDiv('full');

        activeBlock = allBlocks[randomBlock()][0];
        position = 3;
        createBlock();
    }
}

function moveLeft() {
    console.log('jestesmy w move left');
    clearBlock();
    const isAtTheLeftEdge = activeBlock.some(
        blockSmallSquareLocation =>
            (blockSmallSquareLocation + position) % gridWidth === 0
    );
    const isLeftSquareFull = activeBlock.some(blockSquareLocation =>
        playArea[position - 1 + blockSquareLocation].classList.contains('full')
    );

    if (!isAtTheLeftEdge && !isLeftSquareFull) position--;

    createBlock();
}

function control(e) {
    switch (e.keyCode) {
        case 37:
            console.log('37');
            moveLeft();
            break;
    }
}

document.addEventListener('keydown', control);

const Timer = setInterval(moveBlockDown, 1400);
