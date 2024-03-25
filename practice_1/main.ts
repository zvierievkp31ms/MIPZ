type Cell = {
    x: number
    y: number
}

export type Result = {
    winner: number,
    cell?: Cell
}

export const game = function (arr: number[][]) {
    const size = 19;

    const find_sequence_of_5 = function (user_type: number) {
        let length = 0;
        let left_cell: Cell | null = null;
        return {
            form: function (cell: Cell | undefined) {
                if (cell) {
                    if (arr[cell.y][cell.x] === user_type) {
                        if (length === 0) {
                            left_cell = cell;
                        }
                        length += 1;
                    } else {
                        if (length === 5) {
                            return left_cell as Cell;
                        }
                        length = 0;
                        left_cell = null;
                    }
                } else {
                    if (length === 5) {
                        return left_cell as Cell;
                    }
                }
            }
        }
    }

    const check_axles = function (y: number, x: number, start: number, flag: boolean) {
        const line = find_sequence_of_5(arr[y][x]);
        let result;
        const _start = start - 5 > 0 ? start - 5 : 0;
        const _end = start + 5 < size ? start + 5 : size - 1;
        for (let s = _start; s <= _end; s++) {
            result = line.form(flag ? { x: s, y: y } : { x: x, y: s });
            if (result) return { winner: arr[y][x], cell: result } as Result
        }
        result = line.form(undefined);
        if (result) return { winner: arr[y][x], cell: result } as Result
    }

    const check_horizontal = function () {
        for (let x = 4; x < size - 4; x += 5) {
            for (let y = 0; y < size; y++) {
                if (arr[y][x] === 1 || arr[y][x] === 2) {
                    const result = check_axles(y, x, x, true)
                    if (result) return result
                }
            }
        }
    }

    const check_vertical = function () {
        for (let y = 4; y < size - 4; y += 5) {
            for (let x = 0; x < size; x++) {
                if (arr[y][x] === 1 || arr[y][x] === 2) {
                    const result = check_axles(y, x, y, false)
                    if (result) return result
                }
            }
        }
    }

    const get_md_start_end = function (x: number, y: number) {
        let i = 1
        for (; i <= 5; i++) {
            if (y + i >= size || x - i < 0) {
                break;
            }
        }
        i--;
        const start_x = x - i;
        const start_y = y + i;

        i = 1;
        for (; i <= 5; i++) {
            if (y - i < 0 || x + i >= size) {
                break;
            }
        }
        i--;
        const end_x = x + i;
        return { start_x, start_y, end_x }
    }

    const get_sd_start_end = function (x: number, y: number) {
        let i = 1
        for (; i <= 5; i++) {
            if (y - i < 0 || x - i < 0) {
                break;
            }
        }
        i--;
        const start_x = x - i;
        const start_y = y - i;

        i = 1;
        for (; i <= 5; i++) {
            if (y + i >= size || x + i >= size) {
                break;
            }
        }
        i--;

        const end_x = x + i;
        return { start_x, start_y, end_x }
    }

    const check_diagonals = function (x: number, y: number, flag: boolean) {
        const { start_x, start_y, end_x } = flag ? get_md_start_end(x, y) : get_sd_start_end(x, y);

        const line = find_sequence_of_5(arr[y][x]);
        let result;
        for (let i = start_x, k = start_y; i <= end_x; i++, k += flag ? -1 : 1) {
            result = line.form({ x: i, y: k });
            if (result) return { winner: arr[y][x], cell: result } as Result
        }
        result = line.form(undefined);
        if (result) return { winner: arr[y][x], cell: result } as Result
    }

    const check_main_diagonal = function () {
        for (let x = 4; x <= size - 4; x += 5) {
            for (let y = 0; y < size; y++) {
                if (arr[y][x] === 1 || arr[y][x] === 2) {
                    const result = check_diagonals(x, y, true)
                    if (result) return result
                }
            }
        }
    }

    const check_side_diagonal = function () {
        for (let x = 4; x <= size - 4; x += 5) {
            for (let y = 0; y < size; y++) {
                if (arr[y][x] === 1 || arr[y][x] === 2) {
                    const result = check_diagonals(x, y, false)
                    if (result) return result
                }
            }
        }
    }

    if (arr.length === size && arr[0].length === size) {
        const result = check_horizontal() || check_vertical() || check_side_diagonal() || check_main_diagonal();
        return result ? result : { winner: 0 }
    } else {
        console.log('bad input arr shape')
    }
}