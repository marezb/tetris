'use strict';
const scores = {
    topTen: JSON.parse(window.localStorage.getItem('topTen')) || [
        { Tymon: 10 },
        { Tomek: 11 },
        { Marek: 12 },
        { Kamil: 15 },
        { Lukasz: 20 },
        { Scott: 21 },
        { Tim: 22 },
        { Carl: 30 },
        { Anna: 25 },
        { Justyna: 18 },
    ],

    sortTopTen() {
        return this.topTen.sort((a, b) => Object.values(b) - Object.values(a));
    },

    checkScore(value) {
        for (let i = 0; i < 10; i++) {
            let [score] = Object.values(this.topTen[i]);
            if (value > score) {
                let name = window.prompt(`Congratulations! Your score is ${value}.
What is your first name?`);
                this.topTen.push({ [name]: value });
                this.sortTopTen();
                window.localStorage.setItem('topTen', JSON.stringify(this.topTen));

                break;
            }
        }
    },

    drawTopTen() {
        this.sortTopTen();
        const scoreboard = document.querySelector('.scoreboard');
        for (let i = 0; i < 10; i++) {
            const tr = document.createElement('tr');

            const tdIndex = document.createElement('td');
            const tdName = document.createElement('td');
            const tdValue = document.createElement('td');
            // const div = document.createElement('div');
            // let values =
            let index = `${i + 1}.`;
            let [value] = Object.values(this.topTen[i]);
            let [name] = Object.keys(this.topTen[i]);

            tdIndex.innerHTML = index;
            tdName.innerHTML = name;
            tdValue.innerHTML = value;

            scoreboard.appendChild(tr);
            scoreboard.appendChild(tdIndex);
            scoreboard.appendChild(tdName);
            scoreboard.appendChild(tdValue);
        }
    },

    saveTopTen() {
        window.localStorage.setItem('topTen', JSON.stringify(this.topTen));
    },
};

export default scores;
