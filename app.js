'use strict';

import { allBlocks, nextBlocks } from './blocks.js';

const grid = document.querySelector('.grid');
console.log('grid', grid);
const nextBlockGrid = document.querySelector('.grid-next-block');
console.log('nextBlockGrid', nextBlockGrid);

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

//create next block grid
for (let i = 1; i <= 16; i++) {
    const square = document.createElement('div');
    square.classList.add('square');
    square.classList.add('next');
    nextBlockGrid.appendChild(square);
}

//////////////////////////////////////////////////////

const gridWidth = 10;
const randomBlock = () => Math.floor(Math.random() * allBlocks.length);
let choosenBlock = randomBlock();
console.log('choosenBlock START', choosenBlock);
let position = 4;
let rotation = 0;
let activeBlock = allBlocks[choosenBlock][rotation];
const playArea = Array.from(document.querySelectorAll('.hidden'));
console.log('playArea', playArea);
const nextBlockArea = document.querySelectorAll('.next');
console.log('nextBlockArea', nextBlockArea);
let gameSpeed = 11000;
let nextBlockPosition = 1;
let nextBlock;
console.log('nextBlock', nextBlock);
const playButton = document.querySelector('.play-button');
console.log('playButton', playButton);
let timer;

//////////////////////////////////////////////////////

function addClassToDiv(className) {
    activeBlock.forEach(blockSmallSquareLocation => {
        playArea[position + blockSmallSquareLocation].classList.add(className);
    });
}

function createBlock() {
    addClassToDiv('block');
}

function resetBlock() {
    // choosenBlock = randomBlock();
    position = 4;
    rotation = 0;
    choosenBlock = nextBlock;
    activeBlock = allBlocks[choosenBlock][rotation];
    console.log('resetBlock | choosenBlock', choosenBlock);
    createBlock();
    createNextBlock();
}

function clearBlock() {
    activeBlock.forEach(blockSquareLocation => {
        playArea[position + blockSquareLocation].classList.remove('block');
    });
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
        addClassToDiv('full');
        resetBlock();
    }
}

function moveBlockDown() {
    clearBlock();
    position += gridWidth;
    createBlock();
    stopBlockMovement();
}

function controlMovement(e) {
    switch (e.keyCode) {
        case 37:
            return moveLeft();
        case 38:
            return rotateBlock();
        case 39:
            return moveRight();
        case 40:
            return moveBlockDown();
    }
}

console.log(11 % gridWidth);

function moveLeft() {
    clearBlock();
    console.log(position);
    const isAtTheLeftEdge = activeBlock.some(
        blockSmallSquareLocation =>
            (position + blockSmallSquareLocation) % gridWidth === 0
    );

    activeBlock.forEach(blockSmallSquareLocation => {
        console.log('moveLeft | position', position);
        console.log('moveLeft | blockSmallSquareLocation', blockSmallSquareLocation);
        console.log('modulo =', (position + blockSmallSquareLocation) % gridWidth);
    });

    console.log('moveLeft | isAtTheLeftEdge', isAtTheLeftEdge);
    const isLeftSquareFull = activeBlock.some(blockLocation =>
        playArea[position - 1 + blockLocation].classList.contains('full')
    );

    if (!isAtTheLeftEdge && !isLeftSquareFull) position--;
    if (
        activeBlock.some(blockSmallSquareLocation =>
            playArea[position + blockSmallSquareLocation].classList.contains('full')
        )
    )
        position++;

    createBlock();
    stopBlockMovement();
}

function moveRight() {
    clearBlock();
    console.log(position);
    const isAtTheRightEdge = activeBlock.some(
        blockSmallSquareLocation =>
            (blockSmallSquareLocation + position) % gridWidth === 9
    );
    console.log('moveRight | isAtTheRightEdge', isAtTheRightEdge);
    const isRightSquareFull = activeBlock.some(blockSquareLocation =>
        playArea[position + 1 + blockSquareLocation].classList.contains('full')
    );
    console.log('moveRight | isRightSquareFull', isRightSquareFull);

    if (!isAtTheRightEdge && !isRightSquareFull) position++;

    createBlock();
    stopBlockMovement();
}

function rotateBlock() {
    clearBlock();
    rotation++;
    if (rotation === activeBlock.length) rotation = 0;

    activeBlock = allBlocks[choosenBlock][rotation];

    createBlock();
}

function createNextBlock() {
    //first clear next block grid
    nextBlockArea.forEach(square => square.classList.remove('block'));
    nextBlock = randomBlock();
    const showNextBlock = nextBlocks[nextBlock];

    showNextBlock.forEach(nextBlockSmallSquareLocation => {
        nextBlockArea[nextBlockSmallSquareLocation + nextBlockPosition].classList.add(
            'block'
        );
    });
}

document.addEventListener('keydown', controlMovement);

playButton.addEventListener('click', () => {
    if (timer) {
        clearInterval(timer);
        timer = null;
    } else {
        timer = setInterval(moveBlockDown, gameSpeed);
        if (!nextBlock) createNextBlock();
        createBlock();
    }
});
