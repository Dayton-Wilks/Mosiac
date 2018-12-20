/*
* Author: Jiawei Xu
* File: index.js
* Description:
*   -> Stitch component
*   -> Child:
*       -> Panel
*       -> Preview
* Functionality:
*   -> set Data, save, export, add Stitch Files 
*/
import React from "react";
import {render} from "react-dom";
import Preview from "./components/preview";
import Panel from "./components/panel";
import {remote} from "electron";
import {createReadStream} from "fs";
import es from "event-stream";
import Parser from "papaparse";
import {ipcRenderer} from "electron";

import Stitcher from "./../../../../lib/stitching";

class Stitch extends React.Component {
    constructor(props) {
        super(props);
        this.preserveRowTags = true;
        this.state = {
            DATA: [],
            STITCHED_FILES: [],
            UPDATE_TABLE: false,
            INIT_DATA: [],
            INIT_FILE: "",
            ROW_TAGS: [],
            COL_TAGS: []
        };
        this.fileList = React.createRef();
        ipcRenderer.on("message", (e,m)=>{
            const Data = JSON.parse(m);
            if (Data.data.length > 0) {
                if (this.fileList) {
                    this.addOpenedFile(Data.name, this.fileList, "INIT_DATA");
                }
                this.addStitchedFile("INIT_DATA");
                this.setInitData(Data.name, Data.data, Data.rowTags, Data.colTags);
                this.setData(Stitcher.stitch([{filename: "", csv: []}, {filename: Data.name, csv: Data.data}]));
            }
        });
        this.hotInstance = null;
        this.setHotInstance = this.setHotInstance.bind(this);
        this.export = this.export.bind(this);
        this.setData = this.setData.bind(this);
        this.addStitchedFile = this.addStitchedFile.bind(this);
        this.removeStitchedFile = this.removeStitchedFile.bind(this);
        this.updateTable = this.updateTable.bind(this);
        this.openStitchFile = this.openStitchFile.bind(this);
        this.addOpenedFile = this.addOpenedFile.bind(this);
        this.filterData = this.filterData.bind(this);
        this.handleRemoveStitchedFile = this.handleRemoveStitchedFile.bind(this);
        this.saveData = this.saveData.bind(this);
        this.setInitData = this.setInitData.bind(this);
        this.setFileList = this.setFileList.bind(this);
        this.getFileList = this.getFileList.bind(this);
        this.setRowTags = this.setRowTags.bind(this);
        this.setColTags = this.setColTags.bind(this);
        this.saveCurrentTags = this.saveCurrentTags.bind(this);
        this.setPreserveRowTags = this.setPreserveRowTags.bind(this);
    }
    /*
    * function: setData
    * Description:
    * -> Setting the current data
    */
    setData(data) {
        this.setState((prevState, props)=>{
            return {DATA: data};
        });
    }
    setInitData(filename, data, rowTags, colTags) {
        this.setState((prevState, props)=>{
            return {
                ROW_TAGS: rowTags,
                COL_TAGS: colTags,
                INIT_DATA: data,
                INIT_FILE: filename
            }
        })
    }
    setRowTags(tags) {
        this.setState((prevState,props)=>{
            return {ROW_TAGS: tags};
        });
    }
    setColTags(tags) {
        this.setState((prevState,props)=>{
            return {COL_TAGS: tags};
        });
    }
    saveCurrentTags(rowTags, colTags, changes) {
        let tmpColTags = colTags;
        let tmpRowTags = rowTags;
        if (!tmpColTags) {
            tmpColTags = this.hotInstance.getData()[0].map((elem)=>elem);
        }
        if (!rowTags) {
            tmpRowTags = this.hotInstance.getData().map((elem)=>{
                return elem[0];
            });
        }
        tmpRowTags.shift();
        if (changes) {
            if (this.preserveRowTags && changes.previous === changes.default) {
                this.preserveRowTags = false;
                this.setRowTags(tmpRowTags);
            }
        } else {
            this.setRowTags(tmpRowTags);
        }
        this.setColTags(tmpColTags);
    }
    setPreserveRowTags(status) {
        this.preserveRowTags = status;
    }
    /*
    * function: setFileList
    * Description:
    * -> Setting the reference of the filelist
    */
    setFileList(ref) {
        this.fileList = ref;
    }
    /*
    * function: getFileList
    * Description:
    * -> get the current file list component
    */
    getFileList() {
        return this.fileList;
    }
    /*
    * function: addStitchedFile
    * Description:
    * -> add file to list of stitched files
    */
    addStitchedFile(file) {
        const newStitchedFiles = Array.from(this.state.STITCHED_FILES);
        newStitchedFiles.push(file);
        this.setState((prevState, props)=>{
            return {STITCHED_FILES: newStitchedFiles};
        });
    }
    /*
    * function: removeStitchedFile
    * Description:
    * -> remove file from stitched files
    */
    removeStitchedFile(file) {
        const newStitchedFiles = Array.from(this.state.STITCHED_FILES);
        newStitchedFiles.splice(newStitchedFiles.indexOf(file), 1);
        this.setState((prevState, props)=>{
            return {STITCHED_FILES: newStitchedFiles};
        });
    }
    /*
    * function: handleRemoveStitchedFile
    * Description:
    * -> remove file from stitche files and regenerate stitching.
    */
    handleRemoveStitchedFile(file, fileList) {
        const self = this;
        let previousColTags = undefined;
        let previousRowTags = undefined;
        if (self.hotInstance.getData().length > 0) {
            previousColTags = self.hotInstance.getData()[0].map((elem)=>elem);
            previousRowTags = self.hotInstance.getData().map((elem)=>{
                return elem[0];
            });
        }
        this.removeStitchedFile(file);
        const remainingFiles = fileList.filter((elem) => {
            return elem !== file;
        });
        Promise.all(remainingFiles.map((elem) => {
            if (elem !== "INIT_DATA") {
                return self.openFileToStitch(elem, elem.replace(/^.*[\\\/]/, ''));
            } else {
                return Promise.resolve({
                    filename: self.state.INIT_FILE,
                    csv: self.state.INIT_DATA
                });
            }
        })).then((res) => {
            let current = [];
            for (let i = 0; i < res.length; ++i) {
                current = Stitcher.stitch([{ filename: "", csv: current }, res[i]]);
            }
            if (current.length === 0) {
                self.setColTags([]);
                self.setRowTags([]);
            }
            if (previousRowTags && previousColTags) {
                self.saveCurrentTags(previousRowTags,previousColTags);
            }
            self.setData(current);
        }).catch((err) => {
            throw err;
        });
    }
    /*
    * function: addOpenedFile
    * Description:
    * -> add filename to div container of list of opened files
    */
    addOpenedFile(name, elem, filepath) {
        const fileOpened = document.createElement("div");
        const filename = document.createElement("p");
        const fileRemove = document.createElement("span");
        filename.innerHTML = name;
        fileRemove.innerHTML = "x";
        fileRemove.classList.add("fileremove");
        filename.classList.add("filenames");
        fileOpened.classList.add("fileopened");
        fileRemove.setAttribute("filepath", filepath);
        fileRemove.onclick = (e)=>{
            elem.removeChild(fileOpened);
            this.handleRemoveStitchedFile(e.target.getAttribute("filepath"), this.state.STITCHED_FILES);
        };
        fileOpened.appendChild(filename);
        fileOpened.appendChild(fileRemove);
        elem.appendChild(fileOpened);   
    }
    /*
    * function: updateTable
    * Description:
    * -> update the preview table
    */
    updateTable() {
        this.setState((prevState, props)=>{
            return {UPDATE_TABLE: !this.state.UPDATE_TABLE};
        });
    }
    /*
    * function: export
    * Description:
    * -> export current data in table to selected folder
    */
    export() {
        const savePath = remote.dialog.showSaveDialog(remote.getCurrentWindow(), {filters: [{name: "CSV", extensions:["csv"]}]});
        if (savePath) {
            const datToSave = Stitcher.copy(this.hotInstance.getData());
            Stitcher.removeSource(datToSave);
            Stitcher.toCSV(savePath, datToSave);
        }
    }
    /*
    * function: setHotInstance
    * Description:
    * -> set the hotInstance from the table.
    */
    setHotInstance(instance) {
        this.hotInstance = instance;
    }
    /*
    * function: openFileToStitch
    * Description:
    * -> asynchronous using promise to return a parsed matrix of a csv file.
    */
    openFileToStitch(file, filename) {
        return new Promise((resolve, reject)=>{
             const csvData = [];
             let numOfRows = 0;
             let s = createReadStream(file)
             .pipe(es.split())
             .pipe(es.map((line, cb)=>{
                 Parser.parse(line, {
                     step: (row)=> {
                         ++numOfRows;
                         let data = row.data.shift();
                         csvData.push(data);
                         if (numOfRows >= 100) {
                             s.destroy();
                         }
                     }
                 });
                 cb();
             })
             .on('error', (err)=>{
                 reject(err);
             })
             .on('close', ()=>{
                 resolve({filename: filename, csv: csvData});
             })
             .on('end', ()=>{
                 if (s) {
                     s = null;
                 }
             }));
         });
     }
    /*
    * function: openStitchFile
    * Description:
    * -> stitch the matrix from openfiletostitch with the current
    */
    openStitchFile(files) {
        const self = this;
        let previousColTags = undefined;
        let previousRowTags = undefined;
        if (self.hotInstance.getData().length > 0) {
            previousColTags = self.hotInstance.getData()[0].map((elem)=>elem);
            previousRowTags = self.hotInstance.getData().map((elem)=>{
                return elem[0];
            });
        }
        Promise.all(Array.from(files).map((elem)=>{
            return self.openFileToStitch(elem.path, elem.name);
        })).then((result)=>{
            let stitchedData = this.state.DATA;
            const resultLength = result.length;
            for(let i = resultLength; i !== 0; --i) {
                const zeroIndex = resultLength - i;
                this.addStitchedFile(files[zeroIndex].path);
                stitchedData = Stitcher.stitch([{filename: "", csv: stitchedData}, result[zeroIndex]]);
            }
            if (previousColTags) {
                self.saveCurrentTags(previousRowTags,previousColTags);
            }
            self.setData(stitchedData);
        }).catch((err)=>{
            throw err;
        });
    }
    /*
    * function: filterData
    * Description:
    * -> filter the table data with the contains characters
    */
    filterData() {
        let filteredData = [];
        if (this.state.DATA.length > 0) {
            const tmpData = this.state.DATA.map((elem)=>{
                return elem.map((subElem)=>subElem);
            });
            const tmpRowTags = this.state.ROW_TAGS.map((elem)=>elem);
            const tmpColTags = this.state.COL_TAGS.map((elem)=>elem);
            filteredData = Stitcher.filterContains(tmpData, 0, tmpRowTags);
            // filteredData = Stitcher.excludeCols(filteredData);
            // filteredData = Stitcher.excludeRows(filteredData);
            for(let i = 0; i < filteredData.length; ++i) {
                if (i < tmpRowTags.length) {
                    filteredData[i].unshift(tmpRowTags[i]);
                }
                else {
                    filteredData[i].unshift("");
                }
            }
            if (filteredData.length > 0) {
                const colTags = [];
                for(let i = 0; i < filteredData[0].length; ++i) {
                    if (i < tmpColTags.length) {
                        colTags.push(tmpColTags[i]);
                    } else {
                        colTags.push("");
                    }
                }
                filteredData.unshift(colTags);
            }
        }
        return filteredData;
    }
    /*
    * function: saveData
    * Description:
    * -> send matrix from table as a string back to mainwindow
    */
    saveData() {
        if (confirm("Are you sure?")) {
            if (this.hotInstance.getData().length >= 3) {
                const Data = this.hotInstance.getData().map((elem)=>{
                    return elem.map((subElem)=>subElem);
                });
                for(let i = 2; i < Data.length; ++i) {
                    Data[i][0] = Data[i][0].replace(/.csv/g, "");
                }
                Stitcher.removeSource(Data);
                ipcRenderer.send("stitched", JSON.stringify({csv: Data}));
            }
            remote.getCurrentWindow().close();
        }
    }
    render() {
        return (
            <div className={'stitch'}>
                <Panel 
                    EXPORT={this.export}
                    DATA={this.filterData(this.state.DATA)}
                    STITCH_FILES={this.state.STITCHED_FILES}
                    UPDATE_TABLE={this.state.UPDATE_TABLE}
                    setUpdateTable={this.updateTable}
                    addOpenedFile={this.addOpenedFile}
                    openStitchFile={this.openStitchFile}
                    saveData={this.saveData}
                    getFileList={this.getFileList}
                    setFileList={this.setFileList}
                    saveCurrentTags={this.saveCurrentTags}
                    setPreserveRowTags={this.setPreserveRowTags.bind(null, true)}
                    />
                <Preview 
                    setHotInstance={this.setHotInstance}
                    DATA={this.filterData()}
                    UPDATE_TABLE={this.updateTable}
                    setData={this.setData}
                    />
            </div>
        )
    }
}

render(
    <Stitch/>,
    document.getElementById("stitching")
)