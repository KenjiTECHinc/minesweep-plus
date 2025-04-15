import { TLevel } from "../types";

export const CELL_NUMBERS_COLORS = [
    null,
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
];

export const LEVELS = {
    default: {
        rows: 9,
        cols: 9,
        mines: 10,
    },
    extreme: {
        rows: 16,
        cols: 30,
        mines: 99,
    },
    custom: {
        rows: 0,
        cols: 0,
        mines: 0,
    }
}

export const DEFAULT_LEVEL: TLevel = "default";