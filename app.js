'use strict';

import { allBlocks, nextBlocks } from './blocks.js';

const grid = document.querySelector('.grid');
console.log('grid', grid);

const nextBlockGrid = document.querySelector('.grid-next-block');

//create HTML grids and fill with divs
for (let i = 0; i < 200; i++) {
    const square = document.createElement('div');
    square.classList.add('square');
    square.classList.add('hidden');
    grid.appendChild(square);
}

//these divs we need to stop blocks at the bottom of the grid
for (let i = 1; i <= 10; i++) {
    const squareUnderPlayArea = document.createElement('div');
    squareUnderPlayArea.classList.add('full');
    squareUnderPlayArea.classList.add('hidden');
    grid.appendChild(squareUnderPlayArea);
}

//create next block grid
for (let i = 1; i <= 16; i++) {
    const square = document.createElement('div');
    square.classList.add('square');
    square.classList.add('next');
    nextBlockGrid.appendChild(square);
}

//////////////////////////////////////////////////////

let playArea = Array.from(document.querySelectorAll('.hidden'));
const info = document.querySelector('.info');
const playButton = document.querySelector('.play-button');
const scoreHTML = document.querySelector('.score');
const nextBlockArea = document.querySelectorAll('.next');
const gridWidth = 10;
const randomBlock = () => Math.floor(Math.random() * allBlocks.length);
let choosenBlock = randomBlock();
let position = 4;
let rotation = 0;
let activeBlock = allBlocks[choosenBlock][rotation];
let gameSpeed = 1000;
let nextBlockPosition = 1;
let nextBlock;
let timer;
let isPlaying = false;
let score = 0;

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
        countScoreClearLine();
    }
}

function moveBlockDown() {
    clearBlock();
    position += gridWidth;
    createBlock();
    stopBlockMovement();
}

function controlMovement(e) {
    if (isPlaying) {
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
}

function moveLeft() {
    clearBlock();
    const isAtTheLeftEdge = activeBlock.some(
        blockSmallSquareLocation =>
            (position + blockSmallSquareLocation) % gridWidth === 0
    );

    activeBlock.forEach(blockSmallSquareLocation => {});

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
    const isAtTheRightEdge = activeBlock.some(
        blockSmallSquareLocation =>
            (blockSmallSquareLocation + position) % gridWidth === 9
    );
    const isRightSquareFull = activeBlock.some(blockSquareLocation =>
        playArea[position + 1 + blockSquareLocation].classList.contains('full')
    );

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

playButton.addEventListener('click', () => {
    if (timer) {
        clearInterval(timer);
        timer = null;
        isPlaying = false;
        info.innerHTML = 'Game paused';
    } else {
        isPlaying = true;
        timer = setInterval(moveBlockDown, gameSpeed);
        if (!nextBlock) createNextBlock();
        createBlock();
        info.innerHTML = 'Next block';
    }
});

function countScoreClearLine() {
    for (let i = 0; i < 199; i += gridWidth) {
        const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];

        const fullRow = row.every(index => playArea[index].classList.contains('full'));

        if (fullRow) {
            score += 10;
            scoreHTML.innerHTML = `Score ${score}`;
            row.forEach(index => {
                playArea[index].classList.remove('full');
                playArea[index].classList.remove('block');
                // playArea[index].style.backgroundColor = '';
            });
            const lineRemoved = playArea.splice(i, gridWidth);
            playArea = [...lineRemoved, ...playArea];
            playArea.forEach(square => grid.appendChild(square));
        }
    }
}

document.addEventListener('keydown', controlMovement);
