import { load_from_file, write_to_file } from "./file";
import { game, Result } from "./main";

const test_names = ['horizontal', 'vertical', 'side-diagonal', 'main-diagonal'];

const get_path_to_test = (value: string) => {
    return `./examples/tests/test-${value}.txt`
}

const get_path_to_results = (value: string) => {
    return `./examples/results/test-${value}-result.txt`
}

const split_data_for_chunk = function (data: number[][]) {
    const chunkSize = 19;
    let arr = [];
    for (let i = 1; i < data.length; i += chunkSize) {
        arr.push(data.slice(i, i + chunkSize));
    }
    return arr;
}

test_names.forEach(e => {
    const data = load_from_file(get_path_to_test(e)) as number[][];
    const arr = split_data_for_chunk(data);
    if (data[0][0] === arr.length) {
        let result_content: string[] = []
        arr.forEach((sub_arr) => {
            const res = game(sub_arr) as Result
            result_content.push(`${res?.winner}`)
            if (res.cell) result_content.push(`${res.cell?.y + 1} ${res.cell?.x + 1}`)
        })
        write_to_file(get_path_to_results(e), result_content.join('\n'))

    } else {
        console.log('bad input')
    }
});