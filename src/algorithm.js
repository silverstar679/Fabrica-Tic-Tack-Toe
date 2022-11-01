const TURN_EMPTY = 0;
const TURN_PLAYER1 = 1;
const TURN_PLAYER2 = 2;

const getOpposit = (player) => {
    if (player === 1) return 2;
    if (player === 2) return 1;
    return null;
};

const getMapValue = (board) => {
    let ret = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            ret = ret * 3 + board[i][j];
        }
    }
    return ret;
}

const extractMap = (mapValue) => {
    let board = [];
    for (let i = 2; i >= 0; i--) {
        board[i] = [];
        for (let j = 2; j >= 0; j--) {
            board[i][j] = mapValue % 3;
            mapValue = Math.floor(mapValue / 3 + 1e-8);
        }
    }
    return board;
}

const getEmptyPositions = (board) => {
    let emptyPos = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === TURN_EMPTY)
                emptyPos.push([i, j]);
        }
    }
    return emptyPos;
}

const isEnd = (board) => {
    for (let i = 0; i < 3; i++) {
        let cnt3 = [0, 0, 0];
        for (let j = 0; j < 3; j++) {
            ++ cnt3[board[i][j]];
        }
        if (cnt3[1] === 3) return TURN_PLAYER1;
        if (cnt3[2] === 3) return TURN_PLAYER2;
    }

    for (let i = 0; i < 3; i++) {
        let cnt3 = [0, 0, 0];
        for (let j = 0; j < 3; j++) {
            ++ cnt3[board[j][i]];
        }
        if (cnt3[1] === 3) return TURN_PLAYER1;
        if (cnt3[2] === 3) return TURN_PLAYER2;
    }

    let cnt3 = [0, 0, 0];
    for (let i = 0; i < 3; i++) ++ cnt3[board[i][i]];
    if (cnt3[1] === 3) return TURN_PLAYER1;
    if (cnt3[2] === 3) return TURN_PLAYER2;

    cnt3 = [0, 0, 0];
    for (let i = 0; i < 3; i++) ++ cnt3[board[i][2-i]];
    if (cnt3[1] === 3) return TURN_PLAYER1;
    if (cnt3[2] === 3) return TURN_PLAYER2;

    return TURN_EMPTY;
}

const getMapScore = (mapValue, player) => {
    let board = extractMap(mapValue);

    let current_result = isEnd(board);
    if (current_result !== TURN_EMPTY) {
        if (current_result === player)
        return 10;
        return -10;
    }
    
    let emptyPos = getEmptyPositions(board);
    if (emptyPos.length === 0)
        return 0;

    let min_pos = -1, min_scr;

    for (let i = 0; i < emptyPos.length; i++) {
        board[emptyPos[i][0]][emptyPos[i][1]] = player;
        let scr = getMapScore(getMapValue(board), getOpposit(player));
        if (min_pos === -1 || min_scr > scr) {
            min_pos = i;
            min_scr = scr;
        }
        board[emptyPos[i][0]][emptyPos[i][1]] = TURN_EMPTY;
    }

    return -min_scr;
};

// Min-Max algorithm
const getNextTurn = (board, player) => {
    let emptyPos = getEmptyPositions(board);

    if (emptyPos.length === 0)
        return null;

    let min_pos = -1, min_scr;

    for (let i = 0; i < emptyPos.length; i++) {
        board[emptyPos[i][0]][emptyPos[i][1]] = player;
        let scr = getMapScore(getMapValue(board), getOpposit(player));
        if (min_pos === -1 || min_scr > scr) {
            min_pos = i;
            min_scr = scr;
        }
        board[emptyPos[i][0]][emptyPos[i][1]] = TURN_EMPTY;
    }

    return emptyPos[min_pos];
};

exports.getOpposit = getOpposit;
exports.getNextTurn = getNextTurn;
exports.isEnd = isEnd;