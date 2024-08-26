/** @param {NS} ns */

/*
cct problem:

Caesar cipher is one of the simplest encryption techniques. It is a type of substitution cipher in which each letter in the plaintext is replaced by a letter some fixed number of positions down the alphabet. For example, with a left shift of 3, D would be replaced by A, E would become B, and A would become X (because of rotation).

You are given an array with two elements:
  ["ARRAY CACHE TRASH DEBUG LOGIC", 9]
The first element is the plaintext, the second element is the left shift value.

Return the ciphertext as an uppercase string. Spaces remain the same.
*/

export async function main(ns) {

    const uppercaseAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    function ceasar(myString, myInt) {
        let string2 = "";

        for (let i = 0; i < myString.length; i++) {
            let char = myString[i];
            if (char === " ") {
                string2 += " ";
            } else {
                let index = uppercaseAlphabet.indexOf(char);
                if (index !== -1) {
                    // Calculate new position with left shift and handle wrapping around the alphabet
                    let newIndex = (index - myInt + uppercaseAlphabet.length) % uppercaseAlphabet.length;
                    string2 += uppercaseAlphabet[newIndex];
                }
            }
        }

        return string2;
    }

    ns.tprint(ceasar("ARRAY CACHE TRASH DEBUG LOGIC", 9));
}
