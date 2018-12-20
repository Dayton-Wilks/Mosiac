/** ****************************************************************************
/* Name: Lake Sain-Thomason, Isaac Harries
/* email: lakes@flowjo.com, isaach@flowjo.com
/* Date: 09/4/2017
/* Description: The tags objects and data matrix

  Modified by: Morgan Loring
  email: morganl@flowjo.com
  Modified: Dayton Wilks
***************************************************************************** */
import Array2D from 'array2d';
import Tags from './tags';

class AllTags {
  constructor(array) {
    if (!this.preprocessTable(array)) this.table = new Array([null]);
    this.columnTags = new Tags();
    this.rowTags = new Tags();

    this.getMatrix = this.getMatrix.bind(this);
    this.prepareChordMatrix = this.prepareChordMatrix.bind(this);
    this.prepareDefaultTags = this.prepareDefaultTags.bind(this);
    this.getGroupLabels = this.getGroupLabels.bind(this);
    this.createBoxAndWhiskerMatrix = this.createBoxAndWhiskerMatrix.bind(this);
    this.removeNonVisibleTagsFromTable = this.removeNonVisibleTagsFromTable.bind(this);
    this.getSelectedAndVisibleTags_Column = this.getSelectedAndVisibleTags_Column.bind(this);
    this.createChordDiagramData = this.createChordDiagramData.bind(this);

    this.prepareDefaultTags();
    this.state = {
      rowTags: this.rowTags.getTags(),
      columnTags: this.columnTags.getTags()
    };
  }

  /****************************************************************************
* Function: removeNonVisibleTagsFromTable
* Description: return a table with headers, but excludes columns and tags
*         that are marked as not visible.
* Parameters: none
* Returns: Returns an array of data objects with headers
****************************************************************************/
  removeNonVisibleTagsFromTable() {
    let returnMatrix = [];
    let regularMatrix = this.table;
    let rowTags = this.rowTags.getTags();

    returnMatrix.push(regularMatrix[0]); // pushes visible rows to matrix
    for (let rowIndex = 1; rowIndex < regularMatrix.length; ++rowIndex) {
      if (rowTags[rowIndex - 1].visible) {
        let row = regularMatrix[rowIndex];
        if (row[0] === '') row[0] = String(rowIndex);
        returnMatrix.push(regularMatrix[rowIndex]);
      }
    }

    // transpose rows we kept
    regularMatrix = Array2D.transpose(returnMatrix);
    returnMatrix = [regularMatrix[0]];
    let colTags = this.columnTags.getTags();

    // Keep only columns that are visible
    for (let colIndex = 1; colIndex < regularMatrix.length; ++colIndex) {
      if (colTags[colIndex - 1].visible) {
        let col = regularMatrix[colIndex];
        if (col[0] === '') col[0] = String(colIndex);
        returnMatrix.push(regularMatrix[colIndex]);
      }
    }
    if (returnMatrix.length <= 1) return []; // if the matrix is too small, return an empy array instead
    
    return Array2D.transpose(returnMatrix); // transpose to correct orientation and return.
  }

  /****************************************************************************
  * Function: createBoxAndWhiskerMatrix
  * Description: Removes all non-visible rows, transposes, formats data for 
  *   box & whisker, excluding non-visible columns.
  * Parameters: none
  * Returns: Returns table formatted to box & whisker specification.
  ****************************************************************************/
  createBoxAndWhiskerMatrix() {
    let retMap = new Map();
    let originalMatrix = this.getMatrix();
    let middleMatrix = [];
    let rowTagsList = this.rowTags.getTags();

    // Remove non-visible rows
    for (let rowIndex = 0; rowIndex < rowTagsList.length; rowIndex++) {
      if (rowTagsList[rowIndex].visible) {
        middleMatrix.push(originalMatrix[rowIndex]);
      }
    }

    originalMatrix = Array2D.transpose(middleMatrix);

    if (originalMatrix.length <= 0) { return [] } // if too small, retun empty array

    let colTags = this.columnTags.getTags();
    // Add visible cols to map, 
    for (let colIndex = 0; colIndex < colTags.length; colIndex++) {
      if (colTags[colIndex].visible) {
        for (let rowIndex = 0; rowIndex < originalMatrix[colIndex].length; rowIndex++) {
          let currentTag = String(colTags[colIndex].enabled ? colTags[colIndex].tagName : colTags[colIndex].defaultName);
          if (!retMap.has(currentTag)) {
            retMap.set(currentTag, [{ g: currentTag, Value: originalMatrix[colIndex][rowIndex] }]);
          }
          else {
            retMap.get(currentTag).push({ g: currentTag, Value: originalMatrix[colIndex][rowIndex] });
          }
        }
      }
    }

    let ret = []; // output map to array
    for (let [key, value] of retMap) {
      ret.push(value);
    }
    return ret;
  }

  /****************************************************************************
  * Function: getSelectedAndVisibleTags_Column
  * Description: Gets a list of indexes of columns that are have tags, taken 
  *   from tags which are visible. indices are from a table that excludes non-visible
  *   rows and columns.
  * Parameters: none
  * Returns: array containing selected and visible columns indecies
  ****************************************************************************/
  getSelectedAndVisibleTags_Column() {
    var columnTags = this.state.columnTags;
    var columns = [];

    for (let ii = 0; ii < columnTags.length; ii++) {
      if (columnTags[ii].visible) columns.push(columnTags[ii]);
    }

    columnTags = columns;
    columns = [];

    for (let ii = 0; ii < columnTags.length; ii++) {
      if (columnTags[ii].enabled) columns.push(ii);
    }
    return columns;
  }
  /** **************************************************************************
  * Function: getGroupLabels
  * Description: Gets all tags names for groupLabels in visualizations
  * Parameters:
  * Returns: The two arrays joined to the proper format of groupLabels
  *************************************************************************** */
  getGroupLabels() {
    return this.rowTags.getUniqueVisibleTags().concat(this.columnTags.getUniqueVisibleTags());
  }

  /** **************************************************************************
* Function: createChordDiagramData
* Description: Removes non-visible rows, combine rows with same key, 
*   add tags to list transpose, remove non-visible columns, 
*   combine cols with same key, add tags to list, transpose
* Parameters: N/A
* Returns: an object with the formatted matrix and list of row titles, 
*   appended with list of col titles
*************************************************************************** */
  createChordDiagramData() {
    let tableMap = new Map();
    let tableMatrix = this.getMatrix();
    let rowTags = this.rowTags.getTags();
    let newTags = [];

    // Add visible rows to map
    for (let rowIndex = 0; rowIndex < tableMatrix.length; rowIndex++) {
      if (rowTags[rowIndex].visible) {
        let currentTag = String(rowTags[rowIndex].enabled ? rowTags[rowIndex].tagName : rowTags[rowIndex].defaultName);
        if (!tableMap.has(currentTag)) {
          tableMap.set(currentTag, [tableMatrix[rowIndex]]);
        }
        else {
          tableMap.get(currentTag).push(tableMatrix[rowIndex]);
        }
      }
    }

    tableMatrix = []; // combine rows with same tag
    for (let [key, value] of tableMap) {
      tableMatrix.push(this.matriceAddition(value));
      newTags.push(key);
    }

    // tranpose generated table, get column tags, and create new table
    tableMatrix = Array2D.transpose(tableMatrix);
    let colTags = this.columnTags.getTags();
    tableMap.clear();

    // add visible cols to map
    for (let colIndex = 0; colIndex < tableMatrix.length; colIndex++) {
      if (colTags[colIndex].visible) {
        let currentTag = String(colTags[colIndex].enabled ? colTags[colIndex].tagName : colTags[colIndex].defaultName);
        if (!tableMap.has(currentTag)) {
          tableMap.set(currentTag, [tableMatrix[colIndex]]);
        }
        else {
          tableMap.get(currentTag).push(tableMatrix[colIndex]);
        }
      }
    }

    tableMatrix = []; // combine cols with same tag
    for (let [key, value] of tableMap) {
      tableMatrix.push(this.matriceAddition(value));
      newTags.push(key);
    }

    tableMatrix = Array2D.transpose(tableMatrix); // Tranpose again and return in an object with group tags included
    return { matrix: this.prepareChordMatrix(tableMatrix), groupTags: newTags };
  }

  /** **************************************************************************
  * Function: matriceAdditon
  * Description: Performs matrice addition two or more rows in a 2d array
  * Parameters: 2D array theArray
  * Returns: Single dimension array of the added rows
  *************************************************************************** */
  matriceAddition(theArray) {
    const total = [];
    for (let i = 0; i < theArray[0].length; i += 1) {
      let num = 0;
      for (let k = 0; k < theArray.length; k += 1) {
        num += theArray[k][i];
      }
      total.push(num);
    }
    return total;
  }

  /** **************************************************************************
  * Function: prepareDefaultTags
  * Description: Prepares tags by setting default tags to row and column names
  * Parameters: None
  * Returns: None
  *************************************************************************** */
  prepareDefaultTags() {
    let indicies;
    const matrix = this.getMatrix();
    for (let i = 0; i < matrix.length; i += 1) {
      indicies = [];
      indicies.push(i);
      this.rowTags.initializeTag(this.table[i + 1][0], indicies, false);
    }

    if (matrix[0]) {
      for (let k = 0; k < matrix[0].length; k += 1) {
        indicies = [];
        indicies.push(k);
        this.columnTags.initializeTag(this.table[0][k + 1], indicies, false);
      }
    }
  }

  /** **************************************************************************
  * Function: prepareChordMatrix
  * Description: Prepares the matrix by seperating data into quadrants
  * Parameters: The matrix to prepare
  * Returns: The data matrix ready to be passed into a chord diagram
  *************************************************************************** */
  prepareChordMatrix(theMatrix = this.getMatrix()) {
    const matrix = theMatrix;
    const transMatrix = Array2D.transpose(matrix);
    const height = matrix.length;
    const width = matrix.length > 0 ? matrix[0].length : 0;
    const squareDim = height + width;
    const chordMatrix = [];
    let row = [];

    for (let i = 0; i < squareDim; i += 1) {
      row = [];
      for (let k = 0; k < squareDim; k += 1) {
        // Top-Left quadrant
        if (i < height && k < height) row.push(0);
        // Top-Right quadrant
        if (i < height && k >= height) row.push(matrix[i][k - height]);
        // Bottom-Left quadrant
        if (i >= height && k < height) row.push(transMatrix[i - height][k]);
        // Bottom-Right quadrant
        if (i >= height && k >= height) row.push(0);
      }
      chordMatrix.push(row);
    }
    return chordMatrix;
  }

  /** **************************************************************************
  * Function: getMatrix
  * Description: Convert the passed table into a raw data matrix
  * Parameters: None
  * Returns: The data matrix with no column headers or row identifiers
  *************************************************************************** */
  getMatrix() {
    const matrix = [];
    for (let i = 1; i < this.table.length; i += 1) {
      matrix.push(this.table[i].slice(1));
    }
    return matrix;
  }

  /** **************************************************************************
  * Function: preprocessTable
  * Description: Convert the passed table into an appropriate format for Mosaic
  * Parameters: 2DArray
  * Returns: True if Array is defined and parsed successfully
  *************************************************************************** */
  preprocessTable(table) {
    let foundNaN = false;
    // return false immediately if table is undefined
    if (table === undefined) return false;

    // if Array is not a 2DArray, return false
    if (!Array2D.check(table)) return false;

    if (!Array2D.empty(table)) {
      for (let i = 1; !foundNaN && i < Array2D.height(table); i += 1) {
        for (let j = 1; !foundNaN && j < Array2D.width(table); j += 1) {
          if (isNaN(table[i][j])) {
            foundNaN = true;
          }
        }
      }
    }

    if (foundNaN) {
      if (
        // eslint-disable-next-line
        confirm(
          'Data contains non integers, these fields will not ' +
          'be inserted. Would like like to continue?',
        ) === false
      ) {
        return false;
      }
    }

    // convert table to floats
    this.table = AllTags.parseTable(table);
    return true;
  }

  /** **************************************************************************
  * Function: parseTable
  * Description: Parses the table passed into floats
  * Parameters: 2DArray
  * Returns: table parsed
  *************************************************************************** */
  static parseTable(table) {
    const parsedGrid = [];

    for (let i = 0, l1 = table.length; i < l1; i += 1) {
      parsedGrid[i] = [];
      const row = table[i];

      for (let j = 0, l2 = row.length; j < l2; j += 1) {
        const cell = row[j];

        parsedGrid[i][j] = i === 0 || j === 0 ? table[i][j] : parseFloat(cell);
      }
    }
    return parsedGrid;
  }
}

export default AllTags;
