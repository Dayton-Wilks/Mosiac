/****************************************************************
 * Morgan Loring
 * morganl@flowjo.com
 * 8/24/18
 * Description: Functions to save data to files
 ****************************************************************/

import fs from 'fs';
import { remote } from 'electron';

/*********************************************************************
 * saveFile
 * 
 * purpose: Opens a dialog to save a file. Calls the file correct funtion
 *          depending on the type of file chosen
 * 
 * Parameters: dataToWrite: data to write
 *              callback: function to return to after the write
*********************************************************************/
export function saveFile(dataToWrite, callback) {
    const outputFile = remote.dialog.showSaveDialog(remote.getCurrentWindow(), {
        filters: [
            { name: 'Mosaic files', extensions: ['mos'] },
            { name: 'CSV files', extensions: ['csv'] }
        ]
    });

    if(outputFile === undefined) return;

    if (fs.existsSync(outputFile)) {
        fs.unlinkSync(outputFile);
    }
    
    var extension = outputFile.substring(outputFile.lastIndexOf('.'));

    switch (extension) {
        case '.csv':
            writeCSV(outputFile, dataToWrite.tableData, callback);
            break;
        case '.mos':
            writeMOS(outputFile, dataToWrite, callback);
            break;
        default:
            console.log('invalid file type');
            break;
        //error
    }
}

/*********************************************************************
 * writeCSV
 * 
 * purpose: Writes the data to a csv file
 * 
 * Parameters: outputFile: location to save the file
 *              data: data to write
 *              callback: function to return to after the write
*********************************************************************/
export function writeCSV(outputFile, data, callback) {
    const os = fs.createWriteStream(outputFile, { flags: "a+" });
    for (let i = 1; i < data.length; ++i) {
        const row = data[i].slice(1);
        const newCSV = (row.join(",") + (i !== row.length - 1 ? "\n" : ""));
        os.write(newCSV);
    }
    os.end();
    callback(outputFile);
}

/*********************************************************************
 * writeMOS
 * 
 * purpose: writes the data object to a json file
 * 
 * Parameters: outputFile: location to save the file
 *              state: data to write
 *              callback: function to return to after the write
 *              whitespace: seperation character. null by default
*********************************************************************/
export function writeMOS(outputFile, state, callback, whitespace = null) {
    const os = fs.createWriteStream(outputFile, { flags: "a+" });
    os.write(JSON.stringify(state, null, whitespace));
    os.end();
    callback(outputFile);
}