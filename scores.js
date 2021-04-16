const topTen = JSON.parse(window.localStorage.getItem('topTen')) || [
    { Tymon: 10 },
    { Tomek: 11 },
    { Marek: 12 },
    { Kamil: 15 },
    { Lukasz: 20 },
    { Romek: 21 },
    { Tim: 22 },
    { Carl: 30 },
    { Anna: 25 },
    { Justyna: 18 },
];

function sortTopTen() {
    return topTen.sort((a, b) => Object.values(b) - Object.values(a));
}

topTen.forEach((result, idx) =>
    console.log(`${idx + 1} ${Object.keys(result)} ${Object.values(result)}`)
);

sortTopTen();
console.log('topTen', topTen);

function checkScore(value) {
    for (let i = 0; i < 10; i++) {
        let [score] = Object.values(topTen[i]);
        console.log(score);
        if (value > score) {
            let name = window.prompt(`Congratulations! Your score is ${value}.
What is your first name?`);
            console.log('mamy to', value);
            console.log(name);
            topTen.push({ [name]: value });
            sortTopTen();
            console.log(topTen);
            window.localStorage.setItem('topTen', JSON.stringify(topTen));

            break;
        }
    }
}

const scoreboard = document.querySelector('.scoreboard');
for (let i = 0; i < 10; i++) {
    const div = document.createElement('div');
    let score = `${i + 1}. ${Object.keys(topTen[i])} ${Object.values(topTen[i])}`;
    div.innerHTML = score;
    scoreboard.appendChild(div);
}

// const savedFavorites = JSON.parse(window.localStorage.getItem('topTen'));
window.localStorage.setItem('topTen', JSON.stringify(topTen));
