/** @param {NS} ns */
export async function main(ns) {

/*
cct Problem:

We have an array of values inside "stonkvals", and these are the stock prices for
a certain stock for each day. We can only do one purchase and one sell, so compute the
maximum possible profit that could be made with this one transaction.
*/

class Stonk {
    constructor(intValue) {
        this.intValue = intValue;
        this.intArray = [];
    }

    // Method to add a value to the intArray
    addToArray(value) {
        this.intArray.push(value);
    }

    // Method to get the intValue
    getIntValue() {
        return this.intValue;
    }

    // Method to get the intArray
    getIntArray() {
        return this.intArray;
    }
}

let stonkvals = [181, 97, 136, 129, 51, 8, 9, 15, 126, 122, 112, 39, 154, 68, 200, 163, 152, 150, 13, 84, 50, 108, 173, 14, 25, 75, 56, 48, 63];
let stonksList = [];
let greatest = 0;
let greatestPurch = 0;
let greatestSell = 0;

// Populate stonksList with Stonk instances
for (let i = 0; i < stonkvals.length; i++) {
    stonksList.push(new Stonk(stonkvals[i]));
}

// Calculate potential profits and store in intArray
for (let i = 0; i < stonkvals.length; i++) {
    for (let j = i + 1; j < stonkvals.length; j++) {
        stonksList[i].addToArray(stonkvals[j] - stonkvals[i]);
    }
}

// Find the greatest profit
for (let i = 0; i < stonkvals.length; i++) {
    let intArray = stonksList[i].getIntArray();
    for (let j = 0; j < intArray.length; j++) {
        if (intArray[j] > greatest) {
            greatest = intArray[j];
            greatestPurch = stonksList[i].getIntValue();
            greatestSell = greatestPurch + greatest;
        }
    }
}

ns.tprint("Greatest profit is: " + greatest);
ns.tprint("Purchase value: " + greatestPurch);
ns.tprint("Sell value: " + greatestSell);

}
