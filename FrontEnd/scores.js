const SCORES_KEY = 'brickbreaker_scores';
const MAX_SCORES = 5;
const ORDINALS   = ['1ST', '2ND', '3RD', '4TH', '5TH'];

function loadScores() {
    try {
        return JSON.parse(localStorage.getItem(SCORES_KEY)) || [];
    } catch {
        return [];
    }
}

function isHighScore(score) {
    const scores = loadScores();
    if (scores.length < MAX_SCORES) return true;
    return score > scores[scores.length - 1].score;
}

function saveScore(name, score, time) {
    const scores = loadScores();
    scores.push({ name: name.toUpperCase().slice(0, 3), score, time });
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
    const items  = listEl.querySelectorAll('li');
    items.forEach((li, i) => {
        const entry   = scores[i];
        const rankEl  = li.querySelector('.hs-rank');
        const nameEl  = li.querySelector('.hs-name');
        const scoreEl = li.querySelector('.hs-score');
        const timeEl  = li.querySelector('.hs-time');

        if (rankEl)  rankEl.textContent  = ORDINALS[i];
        if (nameEl)  nameEl.textContent  = entry ? entry.name  : '---';
        if (scoreEl) scoreEl.textContent = entry ? entry.score : '---';
        if (timeEl)  timeEl.textContent  = entry ? entry.time + 's' : '---';
    });
}
