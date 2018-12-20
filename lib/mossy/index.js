/*
* Author: Jiawei Xu
* File: index.js
* Date: July 27, 2018
* Liscene: MIT
*
* D3 Versions: v3, v4, v5
*
* Options:
*   -> d3 - required for rendering
*   -> vis - to generate visualization or not, if false, return the normlaized data
*   -> normalize - to decide if to normalize or not, if passing in normalized data, then don't need to
*   -> parent - parent element to generate visual to
*   -> Xmax - maximum value of data, autogen if undefined
*   -> Xmin - minimum value of data, autogen if undefined
*   -> cellSize - size of each cell
*   -> tooltip - to display tooltip or not
*   -> legend - to display legend or not
*   -> fontSize - size of fonts
*   -> fontFamily - font family
*/

const Vis = require("./helper/vis");
const fs = require("fs");

const Mossy = (() => {
  let initOption = {
    d3: undefined,
    vis: true,
    normalize: true,
    parent: "body",
    Xmax: undefined,
    Xmin: undefined,
    cellSize: 15,
    tooltip: true,
    legend: false,
    fontSize: "9pt",
    fontFamily: "Consolas, courier",
    colHeaders: true,
    rowHeaders: true,
    reduce: true
  };
  class Mossy {
    constructor() {
      this.vis = null;
      this.parent = null;
      this.heatMap = this.heatMap.bind(this);
    }

    /*
    * Function: normalize
    * 
    * @param {Array} data - 2d array or matrix
    * @param {Object} options - an object containing the options for the view
    * 
    * Normalizing:
    *   -> Using formula:           (X - Xmin)
    *                        Xn = --------------
    *                              (Xmax - Xmin)
    * 
    * Return:
    *   -> normalized data between 0 to 1.
    */
    normalize(data, options=initOption) {
      const isMatrix = Array.isArray(data[0]);
      if (isMatrix) {
        let Xmin = options.Xmin;
        let Xmax = options.Xmax;
        if (!Xmin || !Xmax) {
          let MinandMax = this.getMinMax(data);
          Xmin = MinandMax[0];
          Xmax = MinandMax[1];
        }
        return this.normalizeData({data: data, Xmax: Xmax, Xmin: Xmin});
      }
      return null;
    }
    ifExist() {
      let status = true;
      if (!this.vis) {
        status = false;
      }
      return status;
    }

    clear() {
      const selector = this.parent.charAt(0);
      let parent = null;
      switch(selector) {
        case "#":
          parent = document.getElementById(this.parent.substring(1));
          break;
        case ".":
          parent = document.getElementsByClassName(this.parent.substring(1))[0];
          break;
        default:
         parent = document.getElementsByTagName(this.parent)[0];
      }
      if (parent) {
        while(parent.firstChild) {
          parent.removeChild(parent.firstChild);
        }
        this.vis = null;
        this.parent = null;
      }
    }

    getMinMax(data) {
      let Xmax = data[0][0];
      let Xmin = data[0][0];
      for(let i = 0; i < data.length; ++i) {
        for(let ii = 0; ii < data[i].length; ++ii) {
          if (data[i][ii] > Xmax) {
            Xmax = data[i][ii];
          }
          if (data[i][ii] < Xmin) {
            Xmin = data[i][ii];
          }
        }
      }
      return [Xmin, Xmax];
    }

    normalizeData(data) {
      let normMatrix = [];
      for(let i = 0; i < data.data.length; ++i) {
        let normRow = [];
        for(let ii = 0; ii < data.data[i].length; ++ii) {
          normRow.push(((data.data[i][ii]-data.Xmin)/(data.Xmax-data.Xmin)));
        }
        normMatrix.push(normRow);
      }
      return normMatrix;
    }

    /*
    * Function: formatData
    * 
    * @param {Array} ori - original matrix
    * @param {Array} data - normalizedData
    * 
    * Return:
    *   -> formattedData into array of objects.
    *   -> I.E:
    *       -> [{Xn: 0.2341, X:647.12, Row: 3}, {Xn: 0.384, X: 703.2, Row: 4}]
    *   -> Row: Row index for current value, Xn: normalized value, X: original value
    */
    formatMatrix(ori, data) {
      let formattedMatrix = [];
      for(let i = 0 ; i < data.length; ++i) {
        let formattedRow = [];
        for(let ii = 0; ii < data[i].length; ++ii) {
          formattedRow.push({
            X: ori[i][ii],
            Xn: data[i][ii],
            Row: i
          });
        }
        formattedMatrix.push(formattedRow);
      }
      return formattedMatrix;
    }

    formatColData(dataCols, colLength) {
      let cols = [];
      for(let i = dataCols.length; i < colLength; ++i) {
        cols.push("col"+ (i+1));
      }
      return cols;
    }

    formatRows(dataValues) {
      let rows = [];
      for(let i = 1; i < dataValues.length; ++i) {
        rows.push("row"+(i));
        for(let ii = 0; ii < dataValues[i].length; ++ii) {
          if (dataValues[i][ii] !== "") {
            dataValues[i][ii] = parseFloat(dataValues[i][ii]);
          } else {
            dataValues[i][ii] = 0;
          }
        }
      }
      return rows;
    }

    setRowHeaders(dataValues, dataRows) {
      let parsedMatrix = [];
      for(let i = 1; i < dataValues.length; ++i) {
        let parsedRow = [];
        dataRows[i-1] = dataValues[i][0];
        for(let ii = 1; ii < dataValues[i].length; ++ii) {
          if (dataValues[i][ii] !== "") {
            parsedRow.push(parseFloat(dataValues[i][ii]));
          } else {
            parsedRow.push(0);
          }
        }
        parsedMatrix.push(parsedRow);
      }
      return parsedMatrix;
    }

    /*
    * Function: formatCols
    * 
    * @param {Array} cols - array of column names
    * @param {Number} dataLength - number of elements in matrix
    * 
    * Description:
    *   -> adds col number if the number of columns are less than the number of elements in a row.
    *   -> removes additional column headers if number of col headers are more than number of elements in row.
    * 
    * Return:
    *   Nothing
    */
    formatCols(cols, dataLength) {
      if (cols.length > dataLength) {
        cols.splice(dataLength, cols.length - dataLength);
      }
      if (cols.length < dataLength - 1) {
        this.formatColData(cols, dataLength);
      }
    }

    /*
    * Function: heatMap
    * 
    * @param {Array} data - data matrix from parser
    * @param {Object} options - configuration for heatmap
    * 
    * Description:
    *   -> generate a heatmap with the following configurations.
    * 
    * Return:
    *   Normalized data if vis is false.
    */
    heatMap(data, options = initOption, callback) {
      const d3 = options.d3;
      let config = Object.assign({}, initOption, options);
      if (d3) {
        this.parent = options.parent;
        let dataValues = Array.from(data);
        let dataCols = [];
        let dataRows = [];
        let normalizedData = dataValues;
        let heatMapData = undefined;
        if (config.colHeaders) {
          dataCols = dataValues.slice(0,1)[0];
          dataCols = dataCols.slice(1);
          for(let i = dataCols.length - 1; i >= 0; --i) {
            if (typeof dataCols[i] !== 'string') {
              dataCols[i] = dataCols[i].toString();
            }
          }
        }
        if (config.rowHeaders) {
          dataValues = this.setRowHeaders(dataValues, dataRows);
        } else {
          dataRows = this.formatRows(dataValues);
        }
        if (config.normalize) {
          normalizedData = this.normalize(dataValues, config);
        }
        heatMapData = this.formatMatrix(dataValues, normalizedData);
        this.formatCols(dataCols, normalizedData[0].length);
        if (config.vis && config.parent) {
          this.vis = new Vis(config.parent);
          this.vis.view(options.d3, {
            cols: dataCols,
            rows: dataRows,
            data: heatMapData,
            cellSize: config.cellSize,
            tooltip: config.tooltip,
            legend: config.legend,
            fontFamily: config.fontFamily,
            fontSize: config.fontSize
          });
          if (callback) {
            callback();
          }
        } else if (!config.vis) {
            return normalizedData;
        }
      }
    }
  }
  return Mossy;
})();
module.exports = Mossy;
