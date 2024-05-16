function countCodeMetrics(lines) {
    let emptyLines = 0;
    let physicalLines = 0;
    let logicalLines = 0;
    let commentLines = 0;
    let complexity = 0;

    function processEmptyLine() {
        emptyLines += 1;
        if (lines.length / 4 > emptyLines) {
            physicalLines += 1;
        }
    }

    function processCommentBlock(index) {
        while (lines.length > index) {
            const nextLine = lines[index++].trim();
            commentLines += 1;
            if (nextLine.endsWith('*/')) {
                return index;
            }
        }
    }

    function isLogicalLineCorrect(line) {
        const keywords = [
            'instanceof', 'in', 'new', 'delete', 'typeof', 'void', 'with',
            'as', 'const', 'let', 'var', 'function', 'class', 'extends',
            'import', 'export', 'await', 'async', 'yield', 'try', 'catch', 'finally',
            'throw', 'if', 'else', 'for', 'while', 'do', 'witch', 'case', 'default',
            'break', 'continue', 'return', 'throw', 'else if',
            '!', '&&', '||', '?',
            '==', '!=', '>=', '<=', '>', '<', '+=', '-=', '*=', '/=', '%='
        ];

        for (let keyword of keywords) {
            if (line.includes(keyword) && !line.includes(['//', '/*', '*/'])) {
                return true;
            }
        }
        return false;
    }

    function processLogicalLine(line) {
        physicalLines += 1;
        const line_parts = line.split(/[,.;()]/);
        line_parts.forEach(part => {
            logicalLines += isLogicalLineCorrect(part) ? 1 : 0;
        });
    }

    // function countCyclomaticComplexity(line) {
    //     const controlFlowStatements = ['switch', 'case', 'if', 'while', 'for', 'catch', '?', '&&', '||'];
    //     controlFlowStatements.forEach(statement => {
    //         complexity += (line.split(['//', '/*'])[0].split(statement).length - 1);
    //     });
    // }

    for (let i = 0; i < lines.length; i++) {
        const trimmedLine = lines[i].trim();
        if (trimmedLine.length === 0) {
            processEmptyLine(lines.length);
            continue;
        } else if (trimmedLine.startsWith('//') || trimmedLine.includes('//')) {
            commentLines += 1;
        } else if (trimmedLine.startsWith('/*') || trimmedLine.includes('/*')) {
            i = processCommentBlock(i);
        }
        processLogicalLine(trimmedLine);
        //countCyclomaticComplexity(trimmedLine);
    }
    return { emptyLines, physicalLines, logicalLines, commentLines, complexity }
}

// Usage:
const codeSnippet = `// Get the speed of

    if (!isTransport()) /* hh*/
    {
        return getManSpeed();; // end
    }
    // Get the speed of
    /* Get the speed of
    */
    if (isCar)
    {
        return getCarSpeed(); /* hi */
    }
    /*
    return 0;*/
  } `;

const test = `for(i=0; i<100; i++) printf("hello"); //hi`;
const test2 = `//hi
for(i=0; i<100; i++)
{
    printf("hello");
}`;
const metrics = countCodeMetrics(codeSnippet.split('\n'));
console.log(metrics);