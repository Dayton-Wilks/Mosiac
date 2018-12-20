/****************************************************************
 * Morgan Loring
 * morganl@flowjo.com
 * 8/24/18
 * Description: Functions to open files
 ****************************************************************/
import { remote } from 'electron';
import { join } from 'path';
import { getAppPath } from './index';
import Store from "../../ReduxStore/reactStore";
import {setLoading} from "../../ReduxStore/actions";
import fs from 'fs';

/*********************************************************************
 * selectOpenFile
 * 
 * purpose: Opens a dialog to open a file. Calls the file correct funtion
 *          depending on the type of file chosen
 * 
 * Parameters: N/A
*********************************************************************/
export function selectOpenFile() {
    const selectedFile = remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
        title: "Open",
        filters: [
            { name: 'Data files', extensions: ['mos', 'csv'] },
            { name: 'Mosaic files', extensions: ['mos'] },
            { name: 'CSV files', extensions: ['csv'] }
        ]
    });

    return selectedFile;
}

/*********************************************************************
 * selectAndOpenFile
 * 
 * purpose: Calls the select file function then calls the 
 *          correct open function
 * 
 * Parameters: cb: callback function
*********************************************************************/
export function selectAndOpenFile(cb) {
    const file = selectOpenFile();
    if (file && cb) {
        var fileType = file[0].substring(file[0].lastIndexOf('.'));
        switch (fileType) {
            case '.csv': {
                openCSV(file[0], cb);
                break;
            }
            case '.mos': {
                openMOS(file[0], cb);
                break;
            }
        }
    }
}

/*********************************************************************
 * openCSV
 * 
 * purpose: Makes a worker that opens the csv file
 * 
 * Parameters: filePath: path to the file to open
 *              cb: callback function
*********************************************************************/
export function openCSV(filePath, cb) {
    Store.dispatch(setLoading(true));
    const Parser = new Worker(join(getAppPath(), "helper", "workers", "parse.js"));
    Parser.onmessage = (e) => {
        const result = JSON.parse(e.data);
        if (result && result.csv) {
            const resultCSV = result.csv;
            addTagCells(resultCSV);
            cb(resultCSV, filePath);
        } else {
            console.log(result.err);
            alert("Parsing Thread Error!");
        }
    }
    Parser.onerror = (e) => {
        console.log(e);
        alert("Parsing Thread Error!");
    }
    Parser.postMessage(JSON.stringify({
        op: "openFile",
        file: filePath
    }));
}

/*********************************************************************
 * openMOS
 * 
 * purpose: Parses the object in the JSON file and returns it to the caller
 * 
 * Parameters: filePath: path to the file to open
 *              callback: callback function
*********************************************************************/
export function openMOS(filePath, callback) {
    const content = fs.readFileSync(filePath);
    var state = JSON.parse(content);
    if (callback !== null) callback(state, filePath);
    else return state;
}

/*********************************************************************
 * addTagCells
 * 
 * purpose: addes the row and column for the tags to the data array
 * 
 * Parameters: src: data array to add the row and column to
*********************************************************************/
export function addTagCells(src) {
    const srcColSize = src[0].length
    const colTags = [];
    let i = srcColSize;
    src[0][0] = "Data";
    while (i !== 0) {
        colTags.push("");
        --i;
    }
    src.unshift(colTags);
    const srcRowSize = src.length;
    i = srcRowSize;
    while (i !== 0) {
        const zeroBaseIndex = srcRowSize - i;
        src[zeroBaseIndex].unshift("");
        --i;
    }
    src[0][0] = 'TAGS';
}