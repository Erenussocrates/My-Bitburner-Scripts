/** @param {NS} ns */
export async function main(ns) {
    let result;

    // Flags to control the phases
    let phase1Completed = false;
    let phase2Completed = false;
    let phase3Completed = false;
    let phase4Completed = false;
    let phase5Completed = false;

    const phase3Positions = [
        ["E", 8], ["E", 9], ["F", 9], ["H", 9], ["J", 9], ["J", 8],
        ["E", 6], ["E", 5], ["F", 5], ["H", 5], ["J", 5], ["J", 6]
    ];

    const phase4Positions = [
        ["C", 8], ["C", 9], ["D", 9], ["K", 9], ["L", 9], ["L", 8],
        ["C", 6], ["C", 5], ["D", 5], ["K", 5], ["L", 5], ["L", 6],
        ["E", 4], ["E", 3], ["F", 3], ["J", 4], ["J", 3], ["H", 3],
        ["E", 10], ["E", 11], ["F", 11], ["J", 10], ["J", 11], ["H", 11]
    ];

    const phase5Positions = [
        ["B", 6], ["B", 5], ["A", 5], ["B", 8], ["B", 9], ["A", 9],
        ["F", 2], ["E", 2], ["E", 1], ["H", 2], ["J", 2], ["J", 1],
        ["F", 12], ["E", 12], ["E", 13], ["H", 12], ["J", 12], ["J", 13],
        ["M", 8], ["M", 9], ["N", 9], ["M", 6], ["M", 5], ["N", 5]
    ];

    const excludedPositions = [
        ["F", 6], ["D", 6], ["A", 6], ["F", 8], ["D", 8], ["A", 8],
        ["H", 6], ["K", 6], ["N", 6], ["H", 8], ["K", 8], ["N", 8],
        ["F", 10], ["F", 13], ["H", 10], ["H", 13], ["F", 4], ["F", 1],
        ["H", 4], ["H", 1]
    ];

    // Convert position from letter-number to x-y coordinates
    const convertToCoordinates = (pos) => {
        const letterMap = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6, H: 7, J: 8, K: 9, L: 10, M: 11, N: 12 };
        const [letter, number] = pos;
        return [letterMap[letter], number - 1];
    };

    // Function to check for available spots in a specific row
    const getValidMovesInRow = (validMoves, row) => {
        const size = validMoves[0].length;
        const rowMoves = [];
        for (let x = 0; x < size; x++) {
            if (validMoves[row][x] === true) {
                rowMoves.push([row, x]);
            }
        }
        return rowMoves;
    };

    // Function to check for available spots in a specific column
    const getValidMovesInColumn = (validMoves, column) => {
        const size = validMoves[0].length;
        const columnMoves = [];
        for (let y = 0; y < size; y++) {
            if (validMoves[y][column] === true) {
                columnMoves.push([y, column]);
            }
        }
        return columnMoves;
    };

    const getValidMoveFromPositions = (validMoves, positions) => {
        const moveOptions = [];

        for (const pos of positions) {
            const [x, y] = convertToCoordinates(pos);
            if (validMoves[x][y] === true) {
                moveOptions.push([x, y]);
            }
        }

        return moveOptions.length > 0 ? moveOptions[Math.floor(Math.random() * moveOptions.length)] : null;
    };

    const getFilteredRandomMove = (validMoves, excludedPositions) => {
        const excludedCoords = excludedPositions.map(convertToCoordinates);
        const moveOptions = [];
        const size = validMoves.length;

        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                if (validMoves[x][y] === true && !excludedCoords.some(([ex, ey]) => ex === x && ey === y)) {
                    moveOptions.push([x, y]);
                }
            }
        }

        return moveOptions.length > 0 ? moveOptions[Math.floor(Math.random() * moveOptions.length)] : null;
    };

    // Function to find and eliminate opponent's blinking clusters
    const getMoveToEliminateBlinkingCluster = (board, validMoves, opponentRouter) => {
        const directions = [
            [0, 1], [1, 0], [0, -1], [-1, 0], // Horizontal and Vertical
            [1, 1], [-1, -1], [1, -1], [-1, 1] // Diagonals
        ];

        for (let y = 0; y < board.length; y++) {
            for (let x = 0; x < board[y].length; x++) {
                if (board[y][x] === opponentRouter) {
                    let adjacentFreeCount = 0;
                    let lastFreeSpot = null;

                    for (const [dx, dy] of directions) {
                        const nx = x + dx;
                        const ny = y + dy;

                        if (nx >= 0 && nx < board[y].length && ny >= 0 && ny < board.length) {
                            if (board[ny][nx] === "") {
                                if (validMoves[ny][nx] === true) {
                                    adjacentFreeCount++;
                                    lastFreeSpot = [ny, nx];
                                }
                            }
                        }
                    }

                    // If there's exactly one free spot adjacent to the cluster
                    if (adjacentFreeCount === 1) {
                        return lastFreeSpot;
                    }
                }
            }
        }
        return null;
    };

    let endTheGame = false;

    do {
        const board = ns.go.getBoardState();
        const validMoves = ns.go.analysis.getValidMoves();
        const playerRouter = "Netburners"; // Replace with the player's router symbol
        const opponentRouter = board[0][0] === playerRouter ? board[1][1] : board[0][0]; // Assumes opponent's router is the other symbol on the board
        let move;

        if (endTheGame) {
            await ns.go.passTurn();
            break;
        }

        // Phase 1: Fill row 7
        if (!phase1Completed) {
            const validRowMoves = getValidMovesInRow(validMoves, 6);
            if (validRowMoves.length > 0) {
                move = validRowMoves[Math.floor(Math.random() * validRowMoves.length)];
            } else {
                phase1Completed = true;
            }
        }

        // Phase 2: Fill column 7
        if (phase1Completed && !phase2Completed) {
            const validColumnMoves = getValidMovesInColumn(validMoves, 6);
            if (validColumnMoves.length > 0) {
                move = validColumnMoves[Math.floor(Math.random() * validColumnMoves.length)];
            } else {
                phase2Completed = true;
            }
        }

        // Phase 3: Place routers in specified positions
        if (phase1Completed && phase2Completed && !phase3Completed) {
            move = getValidMoveFromPositions(validMoves, phase3Positions);
            if (move === null) {
                phase3Completed = true;
            }
        }

        // Phase 4: Place routers in specified positions
        if (phase3Completed && !phase4Completed) {
            move = getValidMoveFromPositions(validMoves, phase4Positions);
            if (move === null) {
                phase4Completed = true;
            }
        }

        // Phase 5: Place routers in specified positions
        if (phase4Completed && !phase5Completed) {
            move = getValidMoveFromPositions(validMoves, phase5Positions);
            if (move === null) {
                phase5Completed = true;
            }
        }

        // Phase 6: Random move, excluding specific spots
        if (phase5Completed) {
            // Attempt to find and eliminate blinking clusters
            move = getMoveToEliminateBlinkingCluster(board, validMoves, opponentRouter);

            // If a blinking cluster is found, override the exclusion rule
            if (move) {
                const [mx, my] = move;
                const excludedCoords = excludedPositions.map(convertToCoordinates);
                const isExcluded = excludedCoords.some(([ex, ey]) => ex === mx && ey === my);

                // If the move is in an excluded position, override the exclusion
                if (isExcluded) {
                    move = [mx, my];
                }
            } else {
                // If no blinking cluster found, fall back to filtered random move
                move = getFilteredRandomMove(validMoves, excludedPositions);
            }
        }

        // If no valid move found (shouldn't happen), pass turn
        if (!move || move.length === 0) {
            result = await ns.go.passTurn();
        } else {
            const [x, y] = move;
            result = await ns.go.makeMove(x, y);
        }

        // Log opponent's next move
        const opponentMove = await ns.go.opponentNextTurn();

        // If the opponent passes their turn, also pass the turn and end the game
        if (opponentMove?.type === "pass") {
            endTheGame = true;
        } 

        await ns.sleep(200); // Slight delay to make the loop less intense

    } while (result?.type !== "gameOver");

    // Determine which opponent to reset the board against
    const resetAgainstNetburners = Math.random() < 0.8; // 80% chance for Netburners, 20% for Slum Snakes

    if (resetAgainstNetburners) {
        ns.go.resetBoardState("Netburners", 13);
    } else {
        ns.go.resetBoardState("Slum Snakes", 13);
    }

    // Start the new game
    ns.exec('master/ipvgo.js', "home");
}
