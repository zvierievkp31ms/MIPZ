import { readFile } from "fs";

function test(subpath: string, typeName: string) {
  readFile(`./examples/results/test-${subpath}-result.txt`, 'utf-8', (err, resultData) => {
    if (err) {
      console.log(`Test for ${typeName}: failed to read result file.`);
    } else {
      readFile(`./examples/expected/test-${subpath}-expected.txt`, 'utf-8', (err, expectedData) => {
        if (err) {
          console.log(`Test for ${typeName}: failed to read file with expected results.\n${err}\n`);
        } else {
          console.log(`Test for ${typeName}: ` + (
            resultData !== expectedData ?
            `results differ from expected. Expected:\n${expectedData}\nReceived:\n${resultData}` :
            'passed.'
          ) + '\n');
        }
      });
    }
  });
}

test('vertical', 'vertical lines');
test('horizontal', 'horizontal lines ');
test('main-diagonal', 'lines on main diagonal');
test('side-diagonal', 'lines on side diagonal');