/** @param {NS} ns */
export async function main(ns) {
    const tile = "[    ]"; // Single tile with 4 spaces between brackets
    const shipTile = "[0000]"; // Tile representing part of a ship
    const separator = "          |          "; // Separator for the rows
    const columns = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K"];
    const rows = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15"];
    let playerBoard = Array(15).fill().map(() => Array(10).fill(tile)); // Player's board
    let opponentBoard = Array(15).fill().map(() => Array(10).fill(tile)); // What the player sees for opponent's board
    let opponentShipLocations = Array(15).fill().map(() => Array(10).fill(tile)); // Actual locations of opponent's ships
    let playerPoints = 14;
    //let lastComputerHit = null;

let playerShips = []; // Array to track player's ships and their health
let opponentShips = []; // Array to track opponent's ships and their health
let playerAttacks = []; // Array to track player’s attacks
let opponentAttacks = []; // Array to track opponent’s attacks

    // Function to handle real-time terminal input
    async function getTerminalInput() {
        while (true) {
            const terminalInput = eval('document.getElementById("terminal-input")');
            if (terminalInput && terminalInput.value.includes(";")) {
                const input = terminalInput.value.trim().replace(";", ""); // Remove semicolon
                terminalInput.value = ""; // Clear the terminal input field
                terminalInput[Object.keys(terminalInput)[1]].onChange({ target: terminalInput }); // Trigger input change
                return input;
            }
            await ns.sleep(100); // Sleep briefly to prevent CPU overload
        }
    }

    // Function to parse input from terminal into direction, column, and row
    function parseInput(input) {
        const parts = input.split(" ");
        if (parts.length !== 3) return null;
        const [direction, column, row] = parts;
        if (!["horizontal", "vertical"].includes(direction) || !columns.includes(column) || !rows.includes(row)) {
            return null;
        }
        return { direction, column, row };
    }

    function parseAttack(input) {
    const parts = input.trim().split(" ");  // Trim to remove any leading/trailing spaces
    if (parts.length !== 2) return null;
    const [column, row] = parts;
    if (!columns.includes(column) || !rows.includes(row)) {
        return null;
    }
    return { column, row };  // Return the parsed column and row as an object
}

// Function to place a ship and add it to the player's or opponent's ship list
function placeShipWithTracking(board, ships, length, direction, column, row) {
    let colIndex = columnToIndex(column);
    let rowIndex = parseInt(row) - 1;
    
    if (!isValidPlacement(board, length, direction, colIndex, rowIndex)) {
        return false;
    }

    let ship = { tiles: [], length: length, hits: 0 };

    // Place the ship and track its tiles
    if (direction === "horizontal") {
        for (let i = -Math.floor(length / 2); i <= Math.floor(length / 2); i++) {
            board[rowIndex][colIndex + i] = shipTile;
            ship.tiles.push({ row: rowIndex, col: colIndex + i });
        }
    } else if (direction === "vertical") {
        for (let i = -Math.floor(length / 2); i <= Math.floor(length / 2); i++) {
            board[rowIndex + i][colIndex] = shipTile;
            ship.tiles.push({ row: rowIndex + i, col: colIndex });
        }
    }

    ships.push(ship);
    return true;
}

// Function to randomly generate a target for the computer's attack
function generateRandomTarget(attacks) {
    let row, col;
    do {
        col = Math.floor(Math.random() * 10); // Random column
        row = Math.floor(Math.random() * 15); // Random row
    } while (attacks.some(attack => attack.row === row && attack.col === col)); // Ensure no repeat attacks
    return { row, col };
}

// Function to handle player’s attack
async function handlePlayerAttack(parsedColumn, parsedRow) {
      
        const colIndex = columnToIndex(parsedColumn);
        const rowIndex = parseInt(parsedRow) - 1;

        // Record the attack
        playerAttacks.push({ row: rowIndex, col: colIndex });

        // Check if it hits an opponent’s ship
        const hitShip = opponentShips.find(ship =>
            ship.tiles.some(tile => tile.row === rowIndex && tile.col === colIndex)
        );
        if (hitShip) {
            hitShip.hits++;
            opponentBoard[rowIndex][colIndex] = "[HIT!]";

            // Check if the ship is fully destroyed
            if (hitShip.hits === hitShip.length) {
                ns.tprint("You sunk an opponent's ship!");
                hitShip.tiles.forEach(tile => {
                    opponentBoard[tile.row][tile.col] = "[XXXX]";
                });
            }
            return true;
        } else {
            opponentBoard[rowIndex][colIndex] = "[MISS]";
            return false;
        }
}

async function handleComputerAttack(playerPoints) {
    let row, col;
    let hitTiles = [];

    // Step 1: Scan the board for all "HIT!" tiles.
    for (let i = 0; i < playerBoard.length; i++) {
        for (let j = 0; j < playerBoard[i].length; j++) {
            if (playerBoard[i][j] === "[HIT!]") {
                hitTiles.push({ row: i, col: j });
            }
        }
    }

    // Step 2: Check adjacent tiles of all "HIT!" tiles to find valid targets.
    let validAdjacentTargets = [];
    for (const hitTile of hitTiles) {
        const { row: hitRow, col: hitCol } = hitTile;

        // Potential adjacent positions (up, down, left, right)
        const adjacentPositions = [
            { row: hitRow - 1, col: hitCol }, // Above
            { row: hitRow + 1, col: hitCol }, // Below
            { row: hitRow, col: hitCol - 1 }, // Left
            { row: hitRow, col: hitCol + 1 }  // Right
        ];

        // Check if the adjacent positions are valid targets
        const validAdjacent = adjacentPositions.filter(({ row, col }) =>
            row >= 0 && row < 15 && col >= 0 && col < 10 &&
            playerBoard[row][col] !== "[HIT!]" && playerBoard[row][col] !== "[XXXX]" && playerBoard[row][col] !== "[MISS]"
        );

        validAdjacentTargets.push(...validAdjacent); // Add valid targets to the list
    }

    // Step 3: If there are valid adjacent targets, choose one randomly.
    if (validAdjacentTargets.length > 0) {
        const target = validAdjacentTargets[Math.floor(Math.random() * validAdjacentTargets.length)];
        row = target.row;
        col = target.col;
    }

    // Step 4: If no valid adjacent tiles, attack randomly.
    if (row === undefined || col === undefined) {
        ({ row, col } = generateRandomTarget(opponentAttacks));
        //lastComputerHit = null; // Reset the last hit if no adjacent targets are found
    }

    opponentAttacks.push({ row, col });

    // Step 5: Check if the computer hits a player’s ship.
    const hitShip = playerShips.find(ship =>
        ship.tiles.some(tile => tile.row === row && tile.col === col)
    );

    if (hitShip) {
        hitShip.hits++;
        playerBoard[row][col] = "[HIT!]";
        playerPoints -= 1;

        // Update lastComputerHit to the current hit location
        //lastComputerHit = { row, col };

        // Step 6: Check if the ship is fully destroyed
        if (hitShip.hits === hitShip.length) {
            console.log("The opponent sunk one of your ships!");
            ns.tprint("The opponent sunk one of your ships!");
            hitShip.tiles.forEach(tile => {
                playerBoard[tile.row][tile.col] = "[XXXX]";
            });
            //lastComputerHit = null; // Reset last hit since the ship is destroyed
        }

        return playerPoints;
    } else {
        playerBoard[row][col] = "[MISS]";
        return playerPoints;
    }
}

// Function to check if all ships of a player are destroyed
function checkAllShipsSunk(ships) {
    return ships.every(ship => ship.hits === ship.length);
}

    // Function to create a single row for the player's and opponent's boards
    function createRow(board, rowIndex) {
        return board[rowIndex].join('');
    }

    // Function to create the header row with column labels
    function createPlayerHeader() {
        let header = '     '; // Space for row labels
        for (let col of columns) {
            header += `  ${col}   `; // Add extra spaces to match tile width
        }
        return header;
    }

    // Function to create the header row with column labels
    function createOpponentHeader() {
        let header = '                    '; // Space for row labels
        for (let col of columns) {
            header += `  ${col}   `; // Add extra spaces to match tile width
        }
        return header;
    }

    // Function to display the boards
    async function displayBoards() {
        let output = "Player's Board".padEnd(70) + "Opponent's Board\n";

        // Create the column headers for both player's and opponent's boards
        const playerHeader = createPlayerHeader();
        const opponentHeader = createOpponentHeader();
        output += `${playerHeader}${opponentHeader}\n`; // Display both headers in the same line

        // Print the row labels and the rows for both boards
        for (let i = 0; i < 15; i++) {
            const playerRow = createRow(playerBoard, i); // Row for player's board
            const opponentRow = createRow(opponentBoard, i); // Hidden row for opponent's board
            const rowLabel = rows[i]; // Row label (01, 02, ..., 15)
            output += `${rowLabel}  ${playerRow}${separator}${opponentRow}  ${rowLabel}\n`;
        }

        await ns.tprint(output); // Output all at once to avoid concurrency issues
    }

    // Helper function to convert column letter to index (A = 0, B = 1, ..., K = 9)
    function columnToIndex(col) {
        return columns.indexOf(col);
    }

    // Helper function to check if a ship placement is valid
    function isValidPlacement(board, length, direction, colIndex, rowIndex) {
        if (direction === "horizontal") {
            // Ensure the ship stays within bounds horizontally
            if (colIndex - Math.floor(length / 2) < 0 || colIndex + Math.floor(length / 2) >= 10) {
                ns.tprint("The ship goes out of bounds! Try again.");
                return false;
            }
            // Check for overlap
            for (let i = -Math.floor(length / 2); i <= Math.floor(length / 2); i++) {
                if (board[rowIndex][colIndex + i] === shipTile) {
                    ns.tprint("Your ships overlap! Try again.");
                    return false;
                }
            }
        } else if (direction === "vertical") {
            // Ensure the ship stays within bounds vertically
            if (rowIndex - Math.floor(length / 2) < 0 || rowIndex + Math.floor(length / 2) >= 15) {
                ns.tprint("The ship goes out of bounds! Try again.");
                return false;
            }
            // Check for overlap
            for (let i = -Math.floor(length / 2); i <= Math.floor(length / 2); i++) {
                if (board[rowIndex + i][colIndex] === shipTile) {
                    ns.tprint("Your ships overlap! Try again.");
                    return false;
                }
            }
        }
        return true;
    }

    // Helper function to randomly generate direction, column, and row for the computer
    function generateRandomPlacement() {
        const direction = Math.random() < 0.5 ? "horizontal" : "vertical";
        const column = columns[Math.floor(Math.random() * columns.length)];
        const row = rows[Math.floor(Math.random() * rows.length)];
        return { direction, column, row };
    }

    // Function to place the computer's ships and track them
function placeComputerShips() {
    ns.tprint("Placing opponent's ships...");

    // Place the 5-tile ship
    let success = false;
    while (!success) {
        const { direction, column, row } = generateRandomPlacement();
        success = placeShipWithTracking(opponentShipLocations, opponentShips, 5, direction, column, row); // Track the ship placement
    }

    // Place three 3-tile ships
    for (let i = 1; i <= 3; i++) {
        success = false;
        while (!success) {
            const { direction, column, row } = generateRandomPlacement();
            success = placeShipWithTracking(opponentShipLocations, opponentShips, 3, direction, column, row); // Track the ship placement
        }
    }

    // The opponent's actual board remains hidden (filled with empty tiles), only opponentShipLocations has the ships
    // opponentBoard remains hidden as empty tiles
}


    // Function to handle ship placement
    // Modify existing ship placement functions to use the tracking system
async function placeShips() {
    ns.tprint("Place your ships on the board.");

    // Place the 5-tile ship
    let success = false;
    while (!success) {
        ns.tprint("Place your 5-tile ship (e.g., 'horizontal D 07'):");
        const input = await getTerminalInput();
        const parsed = parseInput(input);
        if (parsed) {
            success = placeShipWithTracking(playerBoard, playerShips, 5, parsed.direction, parsed.column, parsed.row);
            await displayBoards(); // Update the display
        } else {
            ns.tprint("Invalid input. Please try again. {horizontal OR vertical} {column sign} {row number}");
        }
    }

    // Place three 3-tile ships
    for (let i = 1; i <= 3; i++) {
        success = false;
        while (!success) {
            ns.tprint(`Place your ${i}${["st", "nd", "rd"][i - 1]} 3-tile ship:`);
            const input = await getTerminalInput();
            const parsed = parseInput(input);
            if (parsed) {
                success = placeShipWithTracking(playerBoard, playerShips, 3, parsed.direction, parsed.column, parsed.row);
                await displayBoards(); // Update the display
            } else {
                ns.tprint("Invalid input. Please try again. {horizontal OR vertical} {column sign} {row number}");
            }
        }
    }
}

// Function to reveal the opponent's ships when the computer wins
async function revealOpponentShips() {
    let output = "Player's Board".padEnd(70) + "Opponent's Board (Revealed)\n";

    // Create the column headers for both player's and opponent's boards
    const playerHeader = createPlayerHeader();
    const opponentHeader = createOpponentHeader();
    output += `${playerHeader}${opponentHeader}\n`; // Display both headers in the same line

    // Loop through the rows of both boards
    for (let i = 0; i < 15; i++) {
        const playerRow = createRow(playerBoard, i); // Row for player's board
        const opponentRow = revealRow(opponentBoard, opponentShips, i); // Revealed row for opponent's board
        const rowLabel = rows[i]; // Row label (01, 02, ..., 15)
        output += `${rowLabel}  ${playerRow}${separator}${opponentRow}  ${rowLabel}\n`;
    }

    await ns.tprint(output); // Output all at once to avoid concurrency issues
}

// Helper function to reveal the opponent's ships
function revealRow(board, ships, rowIndex) {
    const row = [];

    for (let colIndex = 0; colIndex < board[rowIndex].length; colIndex++) {
        const tile = board[rowIndex][colIndex];

        if (tile === "[HIT!]" || tile === "[XXXX]" || tile === "[MISS]") {
            row.push(tile); // Keep the existing hits, misses, and destroyed ship markers
        } else {
            // Check if this tile is part of an opponent's ship
            const isShipTile = ships.some(ship => 
                ship.tiles.some(tile => tile.row === rowIndex && tile.col === colIndex)
            );

            if (isShipTile) {
                row.push("[0000]"); // Reveal unhit ship locations
            } else {
                row.push("[    ]"); // Empty sea
            }
        }
    }

    return row.join(""); // Return the formatted row as a string
}

// Gameplay loop
async function playGame(playerPoints) {
    let gameOn = true;

    while (gameOn) {
        // Player’s turn
        while (true) {
            ns.tprint("Choose a location to attack:");
            const input = await getTerminalInput();
            
            const { column: parsedColumn, row: parsedRow } = parseAttack(input) || {};

            // Validate the parsed input
            if (!parsedColumn || !parsedRow || !columns.includes(parsedColumn) || parseInt(parsedRow) < 1 || parseInt(parsedRow) > 15) {
                ns.tprint("Invalid move, try again. {column sign} {row number}");
                continue;
            }

            const colIndex = columnToIndex(parsedColumn);
            const rowIndex = parseInt(parsedRow) - 1;

            // Check if the tile has already been attacked
            const currentTile = opponentBoard[rowIndex][colIndex];
            if (currentTile === "[MISS]" || currentTile === "[HIT!]" || currentTile === "[XXXX]") {
                ns.tprint("You've already attacked this location. Choose a different coordinate.");
                continue; // Skip this turn and prompt the player to select again
            }
            else {
              // Process the player's attack
            await handlePlayerAttack(parsedColumn, parsedRow);
            break;
            }
        }

        // Check if the player has won
        if (checkAllShipsSunk(opponentShips)) {
            await displayBoards();
            ns.tprint("Congratulations! You won!");

            // Execute "client/masterHack.js" on a valid server
        const allServers = ns.read('all-list.txt').split('\n').map(s => s.trim()).filter(s => s !== '');
        const stockServers = ns.read('stock-list.txt').split('\n').map(s => s.trim()).filter(s => s !== '');
        const validServers = allServers.filter(s => 
            ns.hasRootAccess(s) && 
            !stockServers.includes(s) &&
            ns.getServerMaxMoney(s) > 0 &&
            ns.getServerMoneyAvailable(s) > ns.getServerMaxMoney(s) * 0.5
        );

        if (validServers.length > 0) {
            const targetServer = validServers[Math.floor(Math.random() * validServers.length)];
            ns.tprint(`Executing "client/masterHack.js" on server: ${targetServer} with ${playerPoints} threads.`);
            ns.exec("client/masterHack.js", "home", playerPoints, targetServer);
        } else {
            ns.tprint("No valid server found to execute the hack.");
        }
            gameOn = false;
            break;
        }

        // Computer's turn
        ns.tprint("Opponent's turn...");
        playerPoints = await handleComputerAttack(playerPoints);

        await displayBoards();

        // Check if the opponent has won
        if (checkAllShipsSunk(playerShips)) {
            ns.tprint("You lost! The opponent sunk all your ships.");
            ns.tprint("Revealing the opponent's board...");

            // Reveal all remaining opponent ships on their board
            await revealOpponentShips();

            gameOn = false;
            break;
        }
    }
}

    // Start the game by displaying the empty board and placing ships
    await displayBoards();
    ns.tprint("Welcome to the game of Battleship!");
    ns.tprint("First, you will place one 5-tile length ship, and three 3-tile length ships.");
    ns.tprint("You can input the placement as '{horizontal OR vertical} {column} {row}'");
    ns.tprint("Keep in mind that your location will anchor on the ship's center tile.");
    ns.tprint("Then, the opponent will also place their own ships.")
    await placeShips(); // Player places ships
    await placeComputerShips(); // Computer places ships after player
    ns.tprint("Now, the battle starts!");
    await playGame(playerPoints); // Begin the gameplay loop
}
