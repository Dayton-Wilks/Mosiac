/*
* Author: Jiawei Xu
* File: parse.js
* Description:
* -> parse the file using a piped stream.
*/

const openFile = require('./openFile');

function handleResults({ err, csv }) {
    postMessage(JSON.stringify({ err: err, csv: csv }));
}
function operation(e) {
    const op = JSON.parse(e.data);
    switch (op.op) {
        case "openFile":
            openFile(op.file, handleResults);
            break;
    }
}

self.addEventListener("message", operation);

