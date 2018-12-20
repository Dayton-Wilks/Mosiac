const Parser = require("papaparse");
const { createReadStream } = require("fs");
const es = require("event-stream");

/*********************************************************************
 * openFile
 * 
 * purpose: Used in a worker. Parses a csv file
 * 
 * Parameters: file: full path to the file to open
 *              callback: callback funtion to return the data
*********************************************************************/
function openFile(file, callback) {
    let csvData = [];
    let numOfRows = 0;
    let s = createReadStream(file)
        .pipe(es.split())
        .pipe(es.map((line, cb) => {
            Parser.parse(line, {
                dynamicTyping: true,
                step: (row) => {
                    ++numOfRows;
                    let data = row.data.shift();
                    csvData.push(data);
                    if (numOfRows >= 150) {
                        s.destroy();
                    }
                }
            });
            cb();
        })
            .on('error', (err) => {
                callback({ err: err });
            })
            .on('close', () => {
                csvData = csvData.map((elem)=>{
                    if (elem.length >= 150) {
                        return elem.slice(0, 150);
                    }
                    return elem;
                });
                callback({ err: undefined, csv: csvData });
            })
            .on('end', () => {
                if (s) {
                    s = null;
                }
            }));
}

module.exports = openFile;