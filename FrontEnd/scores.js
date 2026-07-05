const SCORES_KEY = 'brickbreaker_scores';
const MAX_SCORES = 5;
const ORDINALS = ['1ST', '2ND', '3RD', '4TH', '5TH'];

function loadScores() {
    try {
        return JSON.parse(localStorage.getItem(SCORES_KEY)) || [];
    } catch {
        return [];
    }
}

function saveScore(score, time) {
    const scores = loadScores();
    scores.push({ score, time });
    scores.sort((a, b) => b.score - a.score);
    scores.splice(MAX_SCORES);
    localStorage.setItem(SCORES_KEY, JSON.stringify(scores));
}

function getBestScore() {
    const scores = loadScores();
    return scores.length ? scores[0].score : 0;
}

function renderLeaderboard(listEl) {
    const scores = loadScores();
    const items = listEl.querySelectorAll('li');
    items.forEach((li, i) => {
        const entry = scores[i];
        const rankEl  = li.querySelector('.hs-rank');
        const scoreEl = li.querySelector('.hs-score');
        const nameEl  = li.querySelector('.hs-name');

        if (rankEl)  rankEl.textContent  = ORDINALS[i];
        if (scoreEl) scoreEl.textContent = entry ? entry.score : '---';
        if (nameEl)  nameEl.textContent  = entry ? `${entry.time}s` : '---';
    });
}
