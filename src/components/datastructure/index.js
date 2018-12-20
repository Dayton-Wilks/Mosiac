/** ****************************************************************************
/* Name: Isaac Harries
/* email: isaach@flowjo.com
/* Date: 07/27/2017
/* Description: Table Data structure helper methods. The table data (2DArray),
/* is managed in Redux. These methods are called from src/Modules/table.js.
/* All functions that are exported are public functions. All other functions
/* are private.
***************************************************************************** */

/* 
* Modified By: Jiawei Xu (Kevin)
* File: index.js
* Description:
*	-> removed papaparse and started using webworker with custom parser.
**/
import Array2D from 'array2d';

/** **************************************************************************
  * Function: parseTable
  * Description: Parses the table passed into floats
  * Parameters: 2DArray
  * Returns: table parsed
  *************************************************************************** */
const parseTable = (data) => {
  const parsedData = [];

  for (let i = 0, l1 = data.length; i < l1; i += 1) {
    parsedData[i] = [];
    const row = data[i];
    for (let j = 0, l2 = row.length; j < l2; j += 1) {
      const cell = row[j];
      if (/^\[0-9]+$/.test(cell)) {
        if (parseFloat(cell)) {
          parsedData[i][j] = parseFloat(cell);
        }
      } else {
        parsedData[i][j] = cell;
      }
    }
  }
  return parsedData;
};

/** **************************************************************************
  * Function: intToBase26
  * Description: Converts integer to base26 for generating column headers
  * Parameters: Integer
  * Returns: String
  *************************************************************************** */
const intToBase26 = (num) => {
  const sequence = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const length = sequence.length;

  if (num <= 0) return num;
  if (num <= length) return sequence[num - 1];

  let index = num % length || length;
  const result = [sequence[index - 1]];

  while ((num = Math.floor((num - 1) / length)) > 0) {
    index = num % length || length;
    result.push(sequence[index - 1]);
  }

  return result.reverse().join('');
};

/** **************************************************************************
  * Function: defaultRowHeaders
  * Description: Generates numeric row Header for table editor
  * Parameters: NA
  * Returns: Array of row headers
  *************************************************************************** */
const defaultRowHeaders = () => {
  const header = [];
  for (let i = 0; i < MAX_HEIGHT; i += 1) {
    header.push((i + 1).toString(10));
  }

  return header;
};

/** **************************************************************************
  * Function: defaultColHeaders
  * Description: Generates alphabetical column headers for table editor
  * Parameters: NA
  * Returns: Array of column headers
  *************************************************************************** */
const defaultColHeaders = () => {
  const header = [];
  for (let i = 0; i < MAX_WIDTH; i += 1) {
    header.push(intToBase26(i));
  }

  return header;
};

/** **************************************************************************
* Function: trimEdges
* Description: Trims the table of any null rows or columns generated from
* using Array2D.glue()
* Parameters: 2DArray
* Returns: Table in its trimmed state
*************************************************************************** */
export function trimEdges(table) {
  let trimmedTable = JSON.parse(JSON.stringify(table));
  let bottomIsNull = true;
  let rightIsNull = true;

  const rightIndex = Array2D.width(trimmedTable) - 1;
  const bottomIndex = Array2D.height(trimmedTable) - 1;

  for (let i = rightIndex; rightIsNull === true; i -= 1) {
    rightIsNull = true;
    const right = Array2D.column(trimmedTable, i);

    right.forEach((e) => {
      if (e !== null) rightIsNull = false;
    });

    if (rightIsNull) {
      trimmedTable = Array2D.rtrim(trimmedTable, 1);
    }
  }

  for (let i = bottomIndex; bottomIsNull; i -= 1) {
    bottomIsNull = true;
    const bottom = Array2D.row(trimmedTable, i);

    bottom.forEach((e) => {
      if (e !== null) {
        bottomIsNull = false;
      }
    });

    if (bottomIsNull) {
      trimmedTable = Array2D.dtrim(trimmedTable, 1);
    }
  }

  return trimmedTable;
}

/** **************************************************************************
  * Function: insertRowDS
  * Description: Inserts an entire row anywhere in the given array
  * Parameters: 2DArray, Int, Array
  * Returns: NA
  *************************************************************************** */
export function insertRowDS(
  data,
  row = 0,
  array = new Array(Array2D.width(data)).fill('')
) {
  let newData = data;
  if (row < MAX_HEIGHT) {
    if (row === 0) {
      newData = Array2D.upad(newData, 1);
      newData = Array2D.spliceRow(newData, row, array);
      newData = Array2D.deleteRow(newData, 1);
    } else if (Array2D.height(newData) === row) {
      newData = Array2D.dpad(newData, 1);
      newData = Array2D.spliceRow(newData, row, array);
      newData = Array2D.dtrim(newData, 1);
    } else if (row > Array2D.height(newData)) {
      const newArray = [];
      newArray.push(array);
      newData = Array2D.glue(newData, newArray, row, 0);
      newData = trimEdges(newData);
    } else {
      newData = Array2D.spliceRow(newData, row, array);
    }

    return newData;
  }
  // eslint-disable-next-line
  alert(`Row cannot be inserted passed max limit: ${MAX_HEIGHT}`);

  return null;
}

/** **************************************************************************
  * Function: insertColDS
  * Description: Inserts a column of data into the given column index. If an
  * array was not passed, it will insert null values. (Array not parsed)
  * Parameters: 2DArray, Int, Array
  * Returns: NA
  *************************************************************************** */
export function insertColDS(
  data,
  column = 0,
  array = new Array(Array2D.height(data)).fill('')
) {
  let newData = JSON.parse(JSON.stringify(data));
  const blankColumn = new Array(Array2D.height(data)).fill('');

  // Array2D.spliceColumn() doesnt work on the edge, so pad it, splice it,
  // then trim it.
  if (column < MAX_WIDTH) {
    if (column === 0) {
      newData = Array2D.lpad(newData, 1);
      newData = Array2D.spliceColumn(newData, column, blankColumn);
      newData = Array2D.ltrim(newData, 1);
    } else if (Array2D.width(newData) === column) {
      newData = Array2D.rpad(newData, 1);
      newData = Array2D.spliceColumn(newData, column, blankColumn);
      newData = Array2D.rtrim(newData, 1);
    } else if (column > 0 && column < Array2D.width(newData)) {
      newData = Array2D.spliceColumn(newData, column, blankColumn);
    }

    let newArray = [];
    newArray.push(array);
    newArray = Array2D.rrotate(newArray);
    newArray = Array2D.glue(newData, newArray, 0, column);

    return trimEdges(newArray);
  }
  alert(`Column cannot be inserted passed max limit: ${MAX_WIDTH}`);

  return null;
}

/** ****************************************************************************
  * Function: generateTable
  * Description: generates a default table that includes headers
  * Parameters: NA
  * Returns: 2DArray
  *************************************************************************** */
export function generateTable() {
  let table = Array2D.build(MAX_WIDTH, MAX_HEIGHT, '');
  table = insertColDS(table, 0, defaultRowHeaders(MAX_WIDTH));
  table = insertRowDS(table, 0, defaultColHeaders(MAX_HEIGHT));

  return table;
}

/** **************************************************************************
  * Function: preprocessTable
  * Description: Convert the passed table into an appropriate format for Mosaic
  * Parameters: 2DArray
  * Returns: 2DArray
  *************************************************************************** */
export function preprocessTable(data) {
  let processData = data;

  // return false immediately if table is undefined
  if (data === undefined) return false;

  // if Array is not a 2DArray, return false
  if (!Array2D.check(processData)) return false;

  // convert table to floats
  return parseTable(processData);
}

/** **************************************************************************
  * Function: copyCells
  * Description: Copies a collection of cells and sends it to the clipboard,
    Known bug: If cells copied are out of bounds, it'll not copy anything
  * Parameters: 2DArray, Int, Int, Int, Int
  * Returns: 2DArray
  *************************************************************************** */
export function copyCells(data, startRow, startCol, endRow, endCol) {
  const width = startCol !== endCol ? endCol - startCol + 1 : 1;
  const height = startRow !== endRow ? endRow - startRow + 1 : 1;

  const copied = Array2D.build(width, height);

  for (let i1 = startRow, i2 = 0; i1 <= endRow; i1 += 1, i2 += 1) {
    for (let j1 = startCol, j2 = 0; j1 <= endCol; j1 += 1, j2 += 1) {
      // copy over value as long as it contains data
      if (Array2D.height(data) > i1 && Array2D.width(data) > j1) {
        copied[i2][j2] = data[i1][j1];
      }
    }
  }

  // elements from data are shallow copied in the for loop so deep copy it
  // afterwards.
  return JSON.parse(JSON.stringify(copied));
}

/** **************************************************************************
  * Function: cutCells
  * Description: Cuts a collection of cells and sends it to the clipboard.
  * Original cells are replaced with nulls
    Known bug: If cells copied are out of bounds, it'll not copy anything
  * Parameters: 2DArray, Int, Int, Int, Int
  * Returns: Object of both the new table data and the cells that cut
  *************************************************************************** */
export function cutCells(data, startRow, startCol, endRow, endCol) {
  const width = startCol !== endCol ? endCol - startCol + 1 : 1;
  const height = startRow !== endRow ? endRow - startRow + 1 : 1;

  const cutData = Array2D.build(width, height);
  const newData = JSON.parse(JSON.stringify(data));

  for (let i1 = startRow, i2 = 0; i1 <= endRow; i1 += 1, i2 += 1) {
    for (let j1 = startCol, j2 = 0; j1 <= endCol; j1 += 1, j2 += 1) {
      // copy over value as long as it contains data
      if (Array2D.height(newData) > i1 && Array2D.width(newData) > j1) {
        cutData[i2][j2] = newData[i1][j1];
        newData[i1][j1] = '';
      }
    }
  }

  return {
    data: newData,
    cutCells: trimEdges(cutData),
  };
}

/** **************************************************************************
  * Function: deleteCellsDS
  * Description: deletes the cells selected
  * Parameters: 2DArray, int, int, int, int
  * Returns: new 2DArray with deleted cells
  *************************************************************************** */
export function deleteCellsDS(data, sRow, sCol, eRow, eCol) {
  const modifiedData = JSON.parse(JSON.stringify(data));

  let startRow = JSON.parse(JSON.stringify(sRow));
  let startCol = JSON.parse(JSON.stringify(sCol));
  let endRow = eRow;
  let endCol = eCol;

  const height = sRow > eRow ? sRow - eRow + 1 : eRow - sRow + 1;
  const width = sCol > eCol ? sCol - eCol + 1 : eCol - sCol + 1;

  // [..., ...] = [..., ...] is an es6 feature that allows for swapping values
  // The reason to swap these values is if the user starts highlight cells from
  // the bottom up.
  if (startRow > endRow) {
    [startRow, endRow] = [endRow, startRow];
  }

  // Same reasoning as the rows, if the user highlights from the right to left,
  // swap values
  if (startCol > endCol) {
    [startCol, endCol] = [endCol, startCol];
  }

  return Array2D.fillArea(modifiedData, startRow, startCol, width, height, '');
}

/** **************************************************************************
  * Function: updateHistory
  * Description: If the user selects undo and makes a modification,
  * reset latest history
  * Parameters: Array, int
  * Returns: Array
  *************************************************************************** */
export function updateHistory(data, history, index) {
  let newHistory = history;
  // If the user selects undo and makes a modification, reset latest history
  if (newHistory.length !== index) {
    newHistory = newHistory.slice(0, index);
  }

  return newHistory;
}
