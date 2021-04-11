const lShape = [
    [1, 11, 21, 2],
    [10, 11, 12, 22],
    [1, 11, 21, 20],
    [10, 20, 21, 22],
];

const zShape = [
    [0, 10, 11, 21],
    [11, 12, 20, 21],
    [0, 10, 11, 21],
    [11, 12, 20, 21],
];

const tShape = [
    [1, 10, 11, 12],
    [1, 11, 12, 21],
    [10, 11, 12, 21],
    [1, 10, 11, 21],
];

const oShape = [
    [0, 1, 10, 11],
    [0, 1, 10, 11],
    [0, 1, 10, 11],
    [0, 1, 10, 11],
];

const iShape = [
    [1, 11, 21, 31],
    [10, 11, 12, 13],
    [1, 11, 21, 31],
    [10, 11, 12, 13],
];
const allBlocks = [lShape, zShape, tShape, oShape, iShape];

const width = 4; //Grid next block width
//bocks needed to show next block
const nextBlocks = [
    [1, width + 1, width * 2 + 1, 2], //l
    [0, width, width + 1, width * 2 + 1], //z
    [1, width, width + 1, width + 2], //t
    [0, 1, width, width + 1], //o
    [1, width + 1, width * 2 + 1, width * 3 + 1], //i
];

export { allBlocks, nextBlocks };
