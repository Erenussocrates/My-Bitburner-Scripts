/** @param {NS} ns */
export async function main(ns) {
    // Open the tail window immediately
    ns.tail();

    const m = 1024;
    const a = 341;
    const c = 1;
    let x = new Date().getTime() % m;

    function predictRNG() {
        x = (a * x + c) % m;
        return x / m;
    }

    function predictOutcome(rngValue) {
        return rngValue < 0.5 ? "H" : "T";
    }

    ns.print("Starting coin flip prediction...");

    while (true) {
        const currentRNG = predictRNG();
        const currentOutcome = predictOutcome(currentRNG);

        let futureRNG = x;
        let futureOutcome = currentOutcome;
        let timeToChange = 0;

        // Look ahead to predict when the outcome will change
        while (futureOutcome === currentOutcome) {
            futureRNG = (a * futureRNG + c) % m;
            futureOutcome = predictOutcome(futureRNG / m);
            timeToChange += 100; // Each step is equivalent to 100ms
        }

        const timeToChangeInSeconds = (timeToChange / 1000).toFixed(2);
        ns.print(`Next flip will be: ${currentOutcome} for ${timeToChangeInSeconds} more seconds.`);

        // Pause the script to allow the user to place the bet manually
        await ns.sleep(1000); // Check every second for updates
    }
}
