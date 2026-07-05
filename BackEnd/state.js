const gameState = {
    score:  0,
    lives:  3,
    time:   0,
    status: 'MENU'
};

const GAME_WIDTH   = 800;
const GAME_HEIGHT  = 600;
const PADDLE_Y     = 570;
const PADDLE_WIDTH = 100;
const BALL_SIZE    = 14;

const brickMap = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    [4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
];
