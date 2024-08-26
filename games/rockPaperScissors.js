/** @param {NS} ns */
export async function main(ns) {
    const rpsMoves = [
        { name: "rock", strongAgainst: "scissors", weakAgainst: "paper" },
        { name: "paper", strongAgainst: "rock", weakAgainst: "scissors" },
        { name: "scissors", strongAgainst: "paper", weakAgainst: "rock" }
    ];

    let playerScore = 0;
    let computerScore = 0;
    let scoreGoal;

    ns.tprint("Welcome to Rock-Paper-Scissors!");
    ns.tprint("Please enter the score goal (a positive integer):");

    // Read and validate score goal from terminal input
    while (true) {
        const terminalInput = eval('document.getElementById("terminal-input")');
        if (terminalInput && terminalInput.value.includes(";")) {
            const inputValue = terminalInput.value.trim().replace(";", ""); // Remove semicolon
            scoreGoal = parseInt(inputValue, 10);

            if (Number.isInteger(scoreGoal) && scoreGoal > 0) {
                ns.tprint(`Score goal set to: ${scoreGoal}`);
                terminalInput.value = ""; // Clear the terminal input field
                terminalInput[Object.keys(terminalInput)[1]].onChange({ target: terminalInput }); // Trigger input change
                break;
            } else {
                ns.tprint("Invalid input. Please enter a valid positive integer for the score goal.");
                terminalInput.value = ""; // Clear the terminal input field
                terminalInput[Object.keys(terminalInput)[1]].onChange({ target: terminalInput }); // Trigger input change
            }
        }
        await ns.sleep(100); // Sleep briefly to prevent CPU overload
    }

    // Main game loop
    while (playerScore < scoreGoal && computerScore < scoreGoal) {
        ns.tprint(`Player Score: ${playerScore} | Computer Score: ${computerScore} | Score Goal: ${scoreGoal}`);
        ns.tprint("Please enter your move (rock/r, paper/p, scissors/s):");

        while (true) {
            const terminalInput = eval('document.getElementById("terminal-input")');
            if (terminalInput && terminalInput.value.includes(";")) {
                let playerMove = terminalInput.value.trim().replace(";", "").toLowerCase(); // Remove semicolon

                if (["rock", "r", "paper", "p", "scissors", "s"].includes(playerMove)) {
                    playerMove = playerMove[0] === "r" ? "rock" : playerMove[0] === "p" ? "paper" : "scissors";

                    // Choose a random move for the computer
                    const computerMove = rpsMoves[Math.floor(Math.random() * rpsMoves.length)].name;

                    ns.tprint(`Computer chose: ${computerMove}`);

                    if (playerMove === computerMove) {
                        ns.tprint("It's a draw! No points awarded.");
                    } else {
                        const playerObj = rpsMoves.find(move => move.name === playerMove);
                        if (playerObj.strongAgainst === computerMove) {
                            ns.tprint("You win this round!");
                            playerScore++;
                        } else {
                            ns.tprint("Computer wins this round!");
                            computerScore++;
                        }
                    }

                    ns.tprint("==================================");
                    terminalInput.value = ""; // Clear the terminal input field
                    terminalInput[Object.keys(terminalInput)[1]].onChange({ target: terminalInput }); // Trigger input change
                    break;
                } else {
                    ns.tprint("Invalid move! Please enter rock/r, paper/p, or scissors/s.");
                    terminalInput.value = ""; // Clear the terminal input field
                    terminalInput[Object.keys(terminalInput)[1]].onChange({ target: terminalInput }); // Trigger input change
                }
            }
            await ns.sleep(100); // Sleep briefly to prevent CPU overload
        }
    }

    // End of game
    if (playerScore >= scoreGoal) {
        ns.tprint("Congratulations! You've won the game!");

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
            ns.tprint(`Executing "client/masterHack.js" on server: ${targetServer} with ${scoreGoal} threads.`);
            ns.exec("client/masterHack.js", "home", scoreGoal, targetServer);
        } else {
            ns.tprint("No valid server found to execute the hack.");
        }
    } else {
        ns.tprint("Game over! The computer won the game.");
    }
}
