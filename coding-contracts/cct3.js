/** @param {NS} ns */

/*

cct problem: 

You are located in the top-left corner of the following grid:

  [[0,1,1,0,1,0,1,0,0],
   [0,0,0,0,0,1,1,1,0],
   [0,0,0,0,0,0,0,0,0],
   [0,0,0,1,0,0,0,0,1],
   [0,0,0,0,1,0,0,0,0],
   [1,0,0,0,0,0,0,1,0],
   [1,1,0,1,0,0,0,0,0]]

You are trying to find the shortest path to the bottom-right corner of the grid, 
but there are obstacles on the grid that you cannot move onto. 
These obstacles are denoted by '1', while empty spaces are denoted by 0.

Determine the shortest path from start to finish, if one exists. 
The answer should be given as a string of UDLR characters, indicating the moves along the path

*/

export async function main(ns) {

  let map = 
  [[0,1,1,0,1,0,1,0,0],
   [0,0,0,0,0,1,1,1,0],
   [0,0,0,0,0,0,0,0,0],
   [0,0,0,1,0,0,0,0,1],
   [0,0,0,0,1,0,0,0,0],
   [1,0,0,0,0,0,0,1,0],
   [1,1,0,1,0,0,0,0,0]];

   /*

This script pads a grid (map) with 1's on the right and bottom sides, then prints the padded map.

*/

 // Dimensions of the original map
    const rows = map.length;
    const cols = map[0].length;

    // Create a new map with additional padding
    let paddedMap = Array.from({ length: rows + 1 }, () => Array(cols + 1).fill(1));

    // Copy the original map into the padded map
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            paddedMap[i][j] = map[i][j];
        }
    }

    // Print the padded map
    ns.tprint("Padded Map:");
    for (let row of paddedMap) {
        ns.tprint(row.join(' '));
    }

  /* 
  The padding was needed, because originally 
  "map[xPos+1][yPos]!=1" was still trying to access map[7][yPos],
   at xPos=6 for example, and that would cause errors.
  */

  //The rest

   let xPos=0;
   let yPos=0;
   let direction = "";

   while (xPos != 6 || yPos != 8){
    if ((xPos<=yPos)&&(paddedMap[xPos+1][yPos]!=1)&&(xPos<6)){
      xPos+=1;
      direction+="D";
    }
    else if ((yPos<xPos)&&(paddedMap[xPos][yPos+1]!=1)&&(yPos<8)){
      yPos+=1;
      direction+="R";
    }
    else if((paddedMap[xPos+1][yPos]!=1)&&(xPos<6)){
      xPos+=1;
      direction+="D";
    }
    else if((paddedMap[xPos][yPos+1]!=1)&&(yPos<8)){
      yPos+=1;
      direction+="R";
    }
   }

   ns.tprint(direction);

}
