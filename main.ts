import { 
  shuffleField as shufflePlayfield,
  getTileIndex as getPlayfieldTileIndex, 
  moveTile as movePlayfieldTile,
  render as renderPlayfield, 
  getSlotsAsString,
  getHint
} from "./playfield.ts";

const inp: Uint8Array = new Uint8Array(1);

function readInput(): string {
  if (Deno.stdin.readSync(inp)) {
    if (inp[0] !== 0xa) {
      return String.fromCharCode(inp[0]);
    }
  }
  return "";
}

if (import.meta.main) {

  let col: string = "";
  let row: string = "";

  let err: string = "";
  let turns: number = 0;

  shufflePlayfield();

  const WIN_STRING: string = "123456780"

  while (true) {

    renderPlayfield();

    if(getSlotsAsString() == WIN_STRING) {
      console.log("You solved it. It tock you ", turns, " turn(s)");
      break;
    }


    if(err.length) {
      console.log("------------------------------------\n", err," \n------------------------------------\n");
      err = "";
    }

    console.log( `which Tile do you want to move (enter row and column. e.g.: "${getHint()}")? : `);
    
    row = readInput();
    col = readInput();

    while (readInput().length > 0) {
      /* NOP: just draining the rest of the input buffer */
    }

    turns++;

    const tile = getPlayfieldTileIndex(row, col);

    if (tile === null) {
      err = " Not a valid Tile ";
      continue;
    }

    if (!movePlayfieldTile(tile)) {
      err = " Tile could not move ";
    };

  }
}
