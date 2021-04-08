const grid = document.querySelector('.grid');

//create grid and fill with squares

for (let i = 0; i < 200; i++) {
    const square = document.createElement('div');
    square.classList.add('square');
    grid.appendChild(square);
}

const squares = Array.from(document.querySelectorAll('.square'));

console.log(squares);
