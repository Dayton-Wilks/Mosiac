/*
* Author: Jiawei Xu
* File: index.js
* Description:
*   -> a file to hold helper functions that are not actions.
*   -> so any file using these functions can just get them from here.
*/

import { ipcRenderer, remote } from "electron";
import fs from "fs";

/*
* Author: Jiawei Xu
* Function: copyArray
* Description:
*   -> copy array or matrix(2d array), return new array.
*/
export function copyArray(src) {
  const result = [], srcRowSize = src.length;
  if (src) {
    if (srcRowSize > 0 && Array.isArray(srcRowSize[0])) {
      for (let i = srcRowSize; i !== 0; --i) {
        const zeroBaseIndex = srcRowSize - i;
        result.push(src.slice(zeroBaseIndex));
      }
    } else {
      for (let i = srcRowSize; i !== 0; --i) {
        const zeroBaseIndex = srcRowSize - i;
        result.push(src[zeroBaseIndex]);
      }
    }
  }
  return result;
}

/*
* Author: Jiawei Xu
* Function: appReady
* Description:
*   -> send message to main informing renderer is ready.
*/
export function appReady() {
  ipcRenderer.send("sync", "windowLoaded");
  window.removeEventListener("onload", appReady, false);
}


/*
* Author: Jiawei Xu
* Function: showOnAppReady
* Description:
*   -> add listener to show renderer on ready.
*/
export function showOnAppReady() {
  window.addEventListener("DOMContentLoaded", appReady, false);
}

/*
* Author: Jiawei Xu
* Function: excludeInvalidCols
* Description:
*   -> exclude columns that are not are number or empty.
*/
export function excludeInvalidCols(src, colTags) {
  const tmpTags = copyArray(colTags),
    tmpArr = copyArray(src),
    tagSize = colTags.length,
    numberOfRows = src.length;
  for (let col = tagSize; col > 0;) {
    //number of invalid cells found in a column
    let invalidFound = 0;
    if (!tmpArr[0][col]) {
      tmpArr[0][col] = "*New Col";
    }
    for (let row = numberOfRows - 1; row > 0; --row) {
      if (tmpArr[row][col] === '' || isNaN(tmpArr[row][col]) || tmpArr[row][col] === null) {
        ++invalidFound;
      }
    }
    //if invalid cell found is the same as the number of rows,
    //then the whole column is invalid
    if (invalidFound === (numberOfRows - 1)) {
      for (let row = numberOfRows - 1; row >= 0; --row) {
        tmpArr[row].splice(col, 1);
      }
      //mark as to be removed.
      tmpTags[col - 1] = 'toBeRemoved';
    }
    --col;
  }

  return Object.assign({}, {
    data: tmpArr,
    columnTags: tmpTags.filter((elem) => {
      return elem !== 'toBeRemoved';
    })
  });
}

/*
* Author: Jiawei Xu
* Function: excludeInvalidColsAndColTags
* Description:
*   -> excludes invalid cols and col tags.
*/
export function excludeInvalidColsAndColTags(src) {
  if (src) {
    const filteredObj = excludeInvalidCols(src.data, src.columnTags);
    filteredObj['rowTags'] = src.rowTags;
    return filteredObj;
  }
  return src;
}

/*
* Author: Jiawei Xu
* Function: excludeInvalidRows
* Description:
*   -> excludes invalid rows, same as excludeinvalidcols.
*/
export function excludeInvalidRows(src, rowTags) {
  const tmpTags = copyArray(rowTags);
  const tmpArr = src.filter((row, index) => {
    if (index === 0) return true;
    let foundInvalidRow = false;
    const colSize = row.length;
    let i = colSize - 1;
    if (!row[0]) {
      row[0] = '*New Row';
    }
    while (i > 0) {
      const zeroBaseIndex = colSize - i;
      if (row[zeroBaseIndex] === '' || isNaN(row[zeroBaseIndex]) || row[zeroBaseIndex] === null) {
        foundInvalidRow = true;
        break;
      }
      --i;
    }
    if (foundInvalidRow) {
      tmpTags[index - 1] = "toBeRemoved";
    }
    return !foundInvalidRow;
  });
  return Object.assign({}, {
    data: tmpArr,
    rowTags: tmpTags.filter((elem) => {
      return elem !== 'toBeRemoved';
    })
  });
}

/*
* Author: Jiawei Xu
* Function: excludeInvalidRowsAndRowTags
* Description:
*   -> excludes invalid rows, same as excludeInvalidColsAndColTags
*/
export function excludeInvalidRowsAndRowTags(src) {
  if (src) {
    const filteredObj = excludeInvalidRows(src.data, src.rowTags);
    filteredObj['columnTags'] = src.columnTags;
    return filteredObj;
  }
  return src;
}

export function copyDir(srcDir, dstDir) {
  let results = [];
  let list = fs.readdirSync(srcDir);
  let src, dst;
  list.forEach(function (file) {
    src = srcDir + "/" + file;
    dst = dstDir + "/" + file;
    let stat = fs.statSync(src);
    if (stat && stat.isDirectory()) {
      try {
        fs.mkdirSync(dst);
      } catch (e) {
        throw e;
      }
      results = results.concat(copyDir(src, dst));
    } else {
      try {
        if (dst.indexOf(".pyc") === -1 && dst.indexOf(".DS_") === -1) {
          fs.writeFileSync(dst, fs.readFileSync(src));
        }
        //fs.createReadStream(src).pipe(fs.createWriteStream(dst));
      } catch (e) {
        throw e;
      }
      results.push(src);
    }
  });
  return results;
}

export function removeDir(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        removeDir(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

export function getAppPath() {
  let appPath = remote.app.getAppPath();
  const ifNodeModules = appPath.indexOf("node_modules");
  if (ifNodeModules !== -1) {
    appPath = appPath.substring(0, ifNodeModules - 1);
  }
  return appPath;
}

export function transpose(src) {
  const newArray = [];
  const srcSize = src.length;
  const srcColSize = src[0].length;
  let i = srcColSize;
  while (i !== 0) {
    const zeroBaseIndex = srcColSize - i;
    newArray.push([]);
    --i;
  }
  i = srcSize;
  while (i !== 0) {
    const zeroBaseIndex = srcSize - i;
    let ii = srcColSize;
    while (ii !== 0) {
      const subZeroBaseIndex = srcColSize - ii;
      newArray[subZeroBaseIndex].push(src[zeroBaseIndex][subZeroBaseIndex]);
      --ii;
    }
    --i;
  }
  return newArray;
}

/*
*   Auth: Dayton Wilks
*   Function: hex
*   Description: Converts a number to bijective hexavigesimal
*   Parameters: an integer value
*   Returns: string representation of passed int in bijective hexavigesimal
*
*/
export const intTo_BijectiveHexavigesimal = (value) => {
  let alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var string = "";

  if (value <= 0) return value;
  if (value < alpha.length) return alpha.charAt(value - 1);

  value += 1;
  let c = 0;
  var x = 1;
  while (value >= x) {
    c++;
    value -= x;
    x *= 26;
  }

  for (var i = 0; i < c; i++) {
    string = alpha.charAt(value % 26) + string;
    value = Math.floor(value / 26);
  }
  return string;
}