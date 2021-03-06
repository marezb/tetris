'use strict';

import { allBlocks, nextBlocks } from './blocks.js';
import scores from './topTen.js';

const grid = document.querySelector('.grid');

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
const levelHTML = document.querySelector('.info-level');
const gridWidth = 10;
const eatRowSound = new Audio('eatRow.mp3');
const landSound = new Audio('land.wav');
const rotateSound = new Audio('rotate.wav');
const gameOverSound = new Audio('gameOver.wav');

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
let level = 1;
let scoreCounter = 10;

const colors = ['#F17105', '#EB9FEF', '#D11149', '#E6C229', '#3185FC'];

//////////////////////////////////////////////////////

function addClassOrColorToDiv(className = null) {
    activeBlock.forEach(blockSquareIndex => {
        let div = playArea[position + blockSquareIndex];
        div.classList.add(className);
        div.style.backgroundColor = colors[choosenBlock];
    });
}

function createBlock() {
    addClassOrColorToDiv();
}

function resetBlock() {
    position = 4;
    rotation = 0;
    choosenBlock = nextBlock;
    activeBlock = allBlocks[choosenBlock][rotation];
    createBlock();
    createNextBlock();
}

function clearBlock() {
    activeBlock.forEach(blockSquareIndex => {
        let div = playArea[position + blockSquareIndex];
        div.style.backgroundColor = null;
        // div.classList.remove('block');
    });
}

function checkIfBlockIsAtTheBottom(activeBlock) {
    return activeBlock.some(blockSquareIndex =>
        playArea[position + blockSquareIndex + gridWidth].classList.contains('full')
    );
}

function stopBlockMovement() {
    if (checkIfBlockIsAtTheBottom(activeBlock)) {
        addClassOrColorToDiv('full');
        resetBlock();
        landSound.play();
        countScoreClearLine();
    }
}

function moveBlockDown() {
    clearBlock();
    position += gridWidth;
    createBlock();
    stopBlockMovement();
    finishTheGame();
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

function changeLevel() {
    if (score % 100 === 0 && gameSpeed >= 200) {
        gameSpeed -= 100;
        level++;
        scoreCounter += 10;
        clearInterval(timer);
        timer = setInterval(moveBlockDown, gameSpeed);
        levelHTML.innerHTML = `Level ${level}`;
    }
}

const isAtTheRightEdge = () =>
    activeBlock.some(
        blockSquareIndex => (position + blockSquareIndex + 1) % gridWidth === 0
    );

const isAtTheLeftEdge = () =>
    activeBlock.some(blockSquareIndex => (position + blockSquareIndex) % gridWidth === 0);

function moveLeft() {
    clearBlock();
    const isLeftSquareFull = activeBlock.some(blockLocation =>
        playArea[position - 1 + blockLocation].classList.contains('full')
    );

    if (!isAtTheLeftEdge() && !isLeftSquareFull) position--;
    if (
        activeBlock.some(blockSquareIndex =>
            playArea[position + blockSquareIndex].classList.contains('full')
        )
    )
        position++;

    checkRotatedPosition();
    createBlock();
    stopBlockMovement();
}

function moveRight() {
    clearBlock();

    const isRightSquareFull = activeBlock.some(blockSquareIndex =>
        playArea[position + 1 + blockSquareIndex].classList.contains('full')
    );

    if (!isAtTheRightEdge() && !isRightSquareFull) position++;

    createBlock();
    stopBlockMovement();
}

// fixing block rotation at the edge

function checkRotatedPosition(pos) {
    pos = pos || position; //get current position.  Then, check if the piece is near the left side.
    if ((pos + 1) % gridWidth < 4) {
        //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).
        if (isAtTheRightEdge()) {
            //use actual position to check if it's flipped over to right side
            position += 1; //if so, add one to wrap it back around
            checkRotatedPosition(pos); //check again.  Pass position from start, since long block might need to move more.
        }
    } else if (pos % gridWidth > 5) {
        if (isAtTheLeftEdge()) {
            position -= 1;
            checkRotatedPosition(pos);
        }
    }
}

function rotateBlock() {
    clearBlock();
    rotation++;
    rotateSound.play();
    if (rotation === activeBlock.length) rotation = 0;

    activeBlock = allBlocks[choosenBlock][rotation];

    checkRotatedPosition();

    createBlock();
}

function createNextBlock() {
    //first clear next block grid
    // nextBlockArea.forEach(square => square.classList.remove('block'));
    nextBlockArea.forEach(square => (square.style.backgroundColor = 'black'));
    nextBlock = randomBlock();
    const showNextBlock = nextBlocks[nextBlock];

    showNextBlock.forEach(nextBlockSquareLocation => {
        const div = nextBlockArea[nextBlockSquareLocation + nextBlockPosition];
        // div.classList.add('block');
        div.style.backgroundColor = colors[nextBlock];
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
            score += scoreCounter;
            changeLevel();
            scoreHTML.innerHTML = `Score ${score}`;
            row.forEach(index => {
                playArea[index].classList.remove('full');
                playArea[index].classList.remove('block');
                playArea[index].style.backgroundColor = null;
            });
            eatRowSound.play();

            const lineRemoved = playArea.splice(i, gridWidth);
            playArea = [...lineRemoved, ...playArea];
            playArea.forEach(square => grid.appendChild(square));
        }
    }
}

function finishTheGame() {
    if (
        activeBlock.some(blockSquareIndex =>
            playArea[blockSquareIndex + position].classList.contains('full')
        )
    ) {
        info.innerHTML = `???? Game Over !! ????`;
        info.style.backgroundColor = '#22212a';
        info.style.color = '#98a59a';
        isPlaying = false;
        clearInterval(timer);
        playButton.disabled = true;
        scores.checkScore(score);
        gameOverSound.play();
        setInterval(() => {
            window.location.reload();
        }, 3000);
    }
}

document.addEventListener('keydown', controlMovement);

scores.drawTopTen();
