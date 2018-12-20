/*
* Author: Jiawei Xu
* File: index.js
* Description:
* -> Stitching library for mosaic that combines two files.
* -> Automatic append missing rows and cols.
* -> Manual options such as filtering and configurations.
*/
const fs = require("fs");
const Stitch = (() => {
  const initialOptions = {
    empty: "0",
    negative: '0',
    excludeRows: [],
    excludeCols: [],
    contains: undefined
  };
  const _config = new WeakMap();
  class Stitch {
    constructor() {
      _config.set(this, initialOptions);
    }
    copy(src) {
      const result = [];
      const srcSize = src.length;
      let i = srcSize;
      while (i !== 0) {
        const zeroIndex = srcSize - i;
        const newRow = [];
        if (Array.isArray(src[zeroIndex])) {
          const srcColSize = src[zeroIndex].length;
          let ii = srcColSize;
          while(ii !== 0) {
            const subZeroIndex = srcColSize - ii;
            newRow.push(src[zeroIndex][subZeroIndex]);
            --ii;
          }
          result.push(newRow);
        } else {
          result.push(src[zeroIndex]);
        }
        --i;
      }
      return result;
    }
    config(options) {
      _config.set(this, Object.assign({}, _config.get(this), options));
      return this;
    }
    getConfig() {
      return _config.get(this);
    }
    toCSV(filename, data) {
      const outputFile = filename;
      const dataSize = data.length;
      const os = fs.createWriteStream(outputFile, { flags: "w" });
      let outputString = "";
      let i = dataSize;
      while (i !== 0) {
        const zeroIndex = dataSize - i;
        outputString +=
          data[zeroIndex].join(",") +
          (zeroIndex !== data.length - 1 ? "\n" : "");
        --i;
      }
      os.write(outputString);
      os.end();
    }
    filterContains(src, start=0, rowTags=[]) {
      let rowTagsIndex = 0;
      const contains = _config.get(this).contains;
      const filteredArray = src.filter((elem, index) => {
        if (index === 0) {
          ++rowTagsIndex;
          return true;
        }
        if (contains) {
            const toBeRemoved = elem[1+start].indexOf(contains);
            if (toBeRemoved === -1) {
              rowTags.splice(rowTagsIndex, 1);
            } else {
              ++rowTagsIndex;
            }
          return (toBeRemoved !== -1);
        } else return true;
      });
      return filteredArray;
    }
    removeEmptyRows(src) {
      if (src.csv.length > 0) {
        const csv = src.csv;
        const emptyCells = ["", "N/A", "NULL", " ", "NAN"];
        let csvSize = csv.length;
        let i = csvSize;
        while (i !== 0) {
          const zeroIndex = csvSize - i;
          const rowSize = csv[zeroIndex].length;
          let emptyRow = true;
          let ii = rowSize - 1;
          while (ii !== 0) {
            const subZeroIndex = rowSize - ii;
            const dataValue = csv[zeroIndex][subZeroIndex];
            const isEmpty = emptyCells.includes(dataValue);
            if (!isEmpty) {
              emptyRow = false;
              break;
            }
            --ii;
          }
          if (emptyRow) {
            csv.splice(zeroIndex, 1);
            csvSize = csv.length;
          } else {
            --i;
          }
        }
      }
    }
    replaceEmptyCells(src, empty, negative) {
      const csv = src.csv;
      const csvSize = csv.length;
      const emptyCells = ["", "N/A", "NULL", " ", "NAN"];
      let i = csvSize - 1;
      while (i !== 0) {
        const zeroIndex = csvSize - i;
        const rowSize = csv[0].length;
        let ii = rowSize - 2;
        while (ii !== 0) {
          const subZeroIndex = rowSize - ii;
          let dataValue = csv[zeroIndex][subZeroIndex];
          if (dataValue) {
            dataValue = dataValue;
            const isEmpty = emptyCells.includes(dataValue);
            if (isEmpty) {
              csv[zeroIndex][subZeroIndex] = empty;
            }
            else if (
              negative &&
              /^[\+\-]?\d*\.?\d+(?:[Ee][\+\-]?\d+)?$/.test(dataValue)
            ) {
              if (parseFloat(dataValue) < 0) {
                csv[zeroIndex][subZeroIndex] = negative;
              }
            }
          } else {
            csv[zeroIndex][subZeroIndex] = empty;
          }
          --ii;
        }
        --i;
      }
    }
    hasDuplicateRows(src) {
      const srcSize = src.length;
      let duplicateRow = false;
      let i = srcSize - 1;
      while (i !== 0 && !duplicateRow) {
        const zeroIndex = srcSize - i;
        let ii = i - 1;
        while (ii !== 0) {
          const subZeroIndex = srcSize - ii;
          if (src[zeroIndex][0] === src[subZeroIndex][0]) {
            duplicateRow = true;
            break;
          }
          --ii;
        }
        --i;
      }
      return duplicateRow;
    }
    addSrcFileName(src, start, filename) {
      const srcSize = src.length;
      let i = srcSize - start;
      while (i !== 0) {
        const zeroIndex = srcSize - i;
        src[zeroIndex].unshift(filename.replace(/,| /g, "_"));
        --i;
      }
    }
    excludeCols(src) {
      const filteredArr = this.copy(src);
      const excludedCols = _config.get(this).excludeCols;
      const excludeColsSize = excludedCols.length;
      let indexOfCol = -1;
      let i = excludeColsSize;
      while (i !== 0) {
        const zeroIndex = excludeColsSize - i;
        indexOfCol = filteredArr[0].indexOf(excludedCols[zeroIndex]);
        if (indexOfCol !== -1) {
          const filteredArrSize = filteredArr.length;
          let ii = filteredArrSize;
          while (ii !== 0) {
            const subZeroIndex = filteredArrSize - ii;
            filteredArr[subZeroIndex].splice(indexOfCol, 1);
            --ii;
          }
        }
        --i;
      }
      return filteredArr;
    }
    excludeRows(src) {
      const excludedRows = _config.get(this).excludeRows;
      return src.filter((elem,index)=>{
        if (index === 0) return true;
        return !excludedRows.includes(elem[0]);
      });
    }
    stitchMatrix(m1, m2) {
      let result = m1 ? this.copy(m1) : [];
      if (m1.length <= 0) {
        result = this.copy(m2.csv);
        const colHeaders = this.copy(result[0]);
        colHeaders[0] = "Data";
        colHeaders.unshift("Source");
        result[0] = colHeaders;
        this.addSrcFileName(result, 1, m2.filename);
      } else {
        const srcCSV = m2.csv;
        const dstCSVColNames = result[0].map((elem, index) => {
          let colName = elem;
          if (typeof colName !== 'string') {
            colName = colName.toString();
          }
          if (index > 1) {
            colName = colName.replace(/-/g, "");
            const isMedian = colName.indexOf("edian");
            if (isMedian !== -1) {
              const afterMedian = colName.substring(isMedian + "edian".length);
              colName = afterMedian.substring(
                afterMedian.indexOf("(") + 1,
                afterMedian.lastIndexOf("(")
              );
            }
          }
          return colName;
        });
        const srcCSVSize = srcCSV.length;
        let i = srcCSVSize - 1;
        while(i !== 0) {
          const zeroIndex = srcCSVSize - i;
          let found = false;
          let foundIndex = -1;
          const newRow = [srcCSV[zeroIndex][0]];
          const rowSize = srcCSV[zeroIndex].length;
          let ii = rowSize - 1;
          while(ii !== 0) {
            const subZeroIndex = rowSize - ii;
            let rowCellColName = srcCSV[0][subZeroIndex];
            if (typeof rowCellColName !== 'string') {
              rowCellColName = rowCellColName.toString();
            }
            let newRowCellColName = rowCellColName.replace(/-/g,"");
            const isMedian = newRowCellColName.indexOf("edian");
            if(isMedian !== -1) {
              const dstCSVColSize = dstCSVColNames.length;
              const afterMedia = newRowCellColName.substring(isMedian + ("edian").length);
              let iii = dstCSVColSize - 2;
              newRowCellColName = afterMedia.substring(afterMedia.indexOf("(") + 1, afterMedia.lastIndexOf("("));
              while(iii !== 0) {
                const subSubZeroIndex = dstCSVColSize - iii;
                if (newRowCellColName.length <= dstCSVColNames[subSubZeroIndex].length) {
                  if(dstCSVColNames[subSubZeroIndex].indexOf(newRowCellColName) !== -1) {
                    found = true;
                    foundIndex = subSubZeroIndex - 1;
                    break;
                  }
                } else {
                  if (newRowCellColName.indexOf(dstCSVColNames[subSubZeroIndex]) !== -1) {
                    found = true;
                    foundIndex = subSubZeroIndex -1;
                    break;
                  }
                }
                --iii;
              }
            } else {
              const newRowCellColNameIndex = dstCSVColNames.indexOf(newRowCellColName);
              if(newRowCellColNameIndex !== -1) {
                found = true;
                foundIndex = newRowCellColNameIndex - 1;
              }
            }
            if (found) {
              newRow[foundIndex] = srcCSV[zeroIndex][subZeroIndex];
              found = false;
            } else {
              result[0].push(rowCellColName);
              dstCSVColNames.push(rowCellColName.replace(/-/g,""));
              newRow[dstCSVColNames.length - 2] = srcCSV[zeroIndex][subZeroIndex];
            }
            --ii;
          }
          result.push(newRow);
          --i;
        }
        this.addSrcFileName(
          result,
          result.length - m2.csv.length + 1,
          m2.filename
        );
      }
      return result;
    }
    removeSource(src) {
      const removedSrcArr = [];
      const srcSize = src.length;
      let i = srcSize;
      while (i !== 0) {
        const zeroIndex = srcSize - i;
        removedSrcArr.push(src[zeroIndex].splice(1,1));
        --i;
      }
      removedSrcArr.shift();
      return removedSrcArr;
    }
    stitch(matrixArrays, options) {
      let stitchedMatrix = [];
      if (matrixArrays[0] && matrixArrays[0].csv.length > 0)
      stitchedMatrix = this.copy(matrixArrays[0].csv);
      _config.set(this, Object.assign({}, _config.get(this), options));
      if (!matrixArrays[1] || !matrixArrays[1].csv) return stitchedMatrix;
      this.removeEmptyRows(matrixArrays[1]);
      stitchedMatrix = this.stitchMatrix(stitchedMatrix, matrixArrays[1]);
      this.replaceEmptyCells({csv: stitchedMatrix}, _config.get(this).empty, _config.get(this).negative);
      return stitchedMatrix;
    }
  }
  return Stitch;
})();

module.exports = new Stitch();
