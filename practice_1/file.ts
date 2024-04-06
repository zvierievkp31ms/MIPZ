import { writeFileSync, readFileSync } from 'fs';

export const write_to_file = function (path: string, content: string) {
    try {
        writeFileSync(path, content);
    } catch (err) {
        console.error(err);
    }
}

const read_from_file = function (path: string) {
    try {
        const data = readFileSync(path, 'utf8');
        return data;
    } catch (err) {
        console.error(err);
    }
}

export const load_from_file = function (path: string) {
    const data = read_from_file(path) as string;
    const array = data.split('\n').map((sub_arr: string) => {
        const arr_string = sub_arr.trim();
        if (arr_string.length > 0) {
            return sub_arr.split('').map(Number);
        }
    })
    return array.filter(item => item !== undefined && !Number.isNaN(item[0]));
}