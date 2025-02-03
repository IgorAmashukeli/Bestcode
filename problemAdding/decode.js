const fs = require('fs');

function readCppFile(filename) {
    try {
        const data = fs.readFileSync(filename, 'utf8');
        return data;
    } catch (err) {
        console.error('Error reading file:', err);
        return null;
    }
}


function escapeString(str) {
    return str.replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');
}


const filename = 'exampleSubmit.cpp';
const fileContent = readCppFile(filename);
if (fileContent !== null) {
    console.log(escapeString(fileContent));
}

