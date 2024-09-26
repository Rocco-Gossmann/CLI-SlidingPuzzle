function str2Uint8Array(str: string): Uint8Array {
    return Uint8Array.from(str.split("").map((e) => e.charCodeAt(0)));
}

const SLOTS_PER_ROW = 3;

const drawSequences = [
    str2Uint8Array("\x1b[2J\x1b[2;1H"),
    str2Uint8Array(" -" + "-".repeat(SLOTS_PER_ROW * 2) + "--\n"),
    str2Uint8Array(" |" + " ".repeat(SLOTS_PER_ROW * 2) + " |\n"),
    str2Uint8Array("\x1b[7;1H"),
];

const slotDrawSequences = [
    str2Uint8Array("\x1b[3;1Ha\x1b[1;4H1\x1b[3;4H"),
    str2Uint8Array("\x1b[1;6H2\x1b[3;6H"),
    str2Uint8Array("\x1b[1;8H3\x1b[3;8H"),
    str2Uint8Array("\x1b[4;1Hb\x1b[4;4H"),
    str2Uint8Array("\x1b[4;6H"),
    str2Uint8Array("\x1b[4;8H"),
    str2Uint8Array("\x1b[5;1Hc\x1b[5;4H"),
    str2Uint8Array("\x1b[5;6H"),
    str2Uint8Array("\x1b[5;8H"),
];

const slotTileSequences = [
    str2Uint8Array(" "),
    str2Uint8Array("1"),
    str2Uint8Array("2"),
    str2Uint8Array("3"),
    str2Uint8Array("4"),
    str2Uint8Array("5"),
    str2Uint8Array("6"),
    str2Uint8Array("7"),
    str2Uint8Array("8"),
];

const frameSequenceRows: number[] = [
    0,
    1,
    2,
    2,
    2,
    1,
];

const slots: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 0];

const slotLabels = [
    "a1", "a2", "a3",
    "b1", "b2", "b3",
    "c1", "c2", "c3",
]

const rowOffsets: { [key: string]: number } = {
    "a": 0,
    "b": 3,
    "c": 6,
};
const colOffsets: { [key: string]: number } = {
    "1": 0,
    "2": 1,
    "3": 2,
};

let zeroSlot = 8;

export function getTileIndex(row: string, col: string): null | number {
    if (rowOffsets[row] === undefined) return null;
    if (colOffsets[col] === undefined) return null;
    return rowOffsets[row] + colOffsets[col];
}

function swapSlots(slotSrc: number, slotDst: number): boolean {
    // DONE: If both slots are the same nothing needs to change
    if (slotSrc == slotDst) return true;

    // DONE: Can't swap none empty tile with other none empty tile
    if (slotSrc != zeroSlot && slotDst != zeroSlot) return false;

    // DONE: Swap content of two slots via Binary opperations
    slots[slotSrc] ^= slots[slotDst];
    slots[slotDst] ^= slots[slotSrc];
    slots[slotSrc] ^= slots[slotDst];

    // DONE: Update zeroSlot to what ever slot of the two was not the zeroslot before
    zeroSlot = (slotDst == zeroSlot) ? slotSrc : slotDst;

    return true;
}

function getNeigborSlots(slot: number, output: number[]) {
    const slotY = Math.floor(slot / SLOTS_PER_ROW);

    // DONE: Check Above
    const slotAbove = slot - SLOTS_PER_ROW;
    if (slotAbove > 0) output.push(slotAbove);

    // DONE: Check Below
    const slotBelow = slot + SLOTS_PER_ROW;
    if (slotBelow < slots.length) output.push(slotBelow);

    // DONE: Check Left
    const slotLeft = slot - 1;
    if (Math.floor(slotLeft / SLOTS_PER_ROW) == slotY) {
        output.push(slotLeft);
    }

    // DONE: Check Right
    const slotRight = slot + 1;
    if (Math.floor(slotRight / SLOTS_PER_ROW) == slotY) {
        output.push(slotRight);
    }
}

export function shuffleField() {
    const slotList: number[] = [];

    // start:
    for (let a = 0; a < 300; a++) {
        slotList.splice(0, slotList.length);

        //DONE: Construct List of slots to swap with (from current zeroSlot)
        getNeigborSlots(zeroSlot, slotList);

        //DONE: select one of that list at random
        //DONE: swap zeroSlot with selected
        swapSlots(
            zeroSlot,
            slotList[
                Math.round(
                    Math.random() * (
                        slotList.length - 1
                    ),
                )
            ],
        );

        //DONE: repeat: start
    }
}

export function moveTile(index: number | null): boolean {
    if (index !== null && index > -1 && index < slots.length) {
        const slotY = Math.floor(index / SLOTS_PER_ROW);

        // DONE: Check Above
        const slotAbove = index - SLOTS_PER_ROW;
        if (slotAbove == zeroSlot) {
            return swapSlots(index, slotAbove);
        }

        // DONE: Check Below
        const slotBelow = index + SLOTS_PER_ROW;
        if (slotBelow == zeroSlot) {
            return swapSlots(index, slotBelow);
        }

        // DONE: Check Left
        const slotLeft = index - 1;
        if (Math.floor(slotLeft / SLOTS_PER_ROW) == slotY && slotLeft == zeroSlot) {
            return swapSlots(index, slotLeft);
        }

        // DONE: Check Right
        const slotRight = index + 1;
        if (Math.floor(slotRight / SLOTS_PER_ROW) == slotY && slotRight == zeroSlot) {
            return swapSlots(index, slotRight);
        }
    }

    return false;
}

export function render() {
    for (let a = 0; a < frameSequenceRows.length; a++) {
        Deno.stdout.writeSync(drawSequences[frameSequenceRows[a]]);
    }

    for (let a = 0; a < SLOTS_PER_ROW * SLOTS_PER_ROW; a++) {
        Deno.stdout.writeSync(slotDrawSequences[a]);
        Deno.stdout.writeSync(slotTileSequences[slots[a]]);
    }
    Deno.stdout.writeSync(drawSequences[3]);
}

const out: number[] = [];
export function getHint(): string {
    out.splice(0, out.length)
    getNeigborSlots(zeroSlot, out)
    return slotLabels[out[0]];
}

export function getSlotsAsString(): string {
    return slots.join("");
}
