/*
* Author: Dayton Wilks
* File: actions.js
* Description: 
*   This file holds store actions as well as table data transormation functions.
*   Also includes functions that signal content loaded to windows.
*/

import { remote } from "electron";
import { copyDir } from "../helper/func";
import TYPES from './stateTypes';
import Path from 'path';
import fs from "fs";
import { spawn } from "child_process";
import Mossy from "../../lib/mossy";
import * as d3 from "d3";

/*
*   Auth: Dayton Wilks
*   Function: transform_dataTable
*   Description: Returns table split into table, colTags, rowTags
*   Parameters: 2D Array with tags and headers for each col/row
*   Returns: Formatted table or an object with empty fields
*/
export function transform_dataTable(tableData) {
    let ret = { rowTags: [], columnTags: [], data: [] };

    for (let y = 1; y < tableData.length; ++y) {
        ret.data.push(tableData[y].slice(1));
        if (y > 1)
            ret.rowTags.push(tableData[y][0]);
    }
    ret.columnTags = tableData[0].slice(2);

    return ret;
}

/*
*   Auth: Dayton Wilks
*   Function: transform_dataTable
*   Description: Returns table split into table, colTags, rowTags
*   Parameters: 2D Array with tags and headers for each col/row
*   Returns: Formatted table or an object with empty fields
*/
export function transpose2DArray(tableData = []) {
    let newTable = [];

    for (let x = 0; x < tableData[0].length; ++x) {
        let row = [];
        for (let y = 0; y < tableData.length; ++y) {
            row.push(tableData[y][x]);
        }
        newTable.push(row);
    }

    return newTable;
}

export function setIsStitchWindowActive(status) {
    return {
        type: TYPES.SET_STITCH_ACTIVE,
        payload: status
    }
}

export function setFile(file) {
    return {
        type: TYPES.SET_FILE,
        payload: file
    };
}

export function setTable(data) {
    return {
        type: TYPES.SET_TABLE,
        payload: data
    };
}

export function updateTable(data) {
    return dispatch => {
        setTimeout(() => {
            dispatch(setLoading(false));
        }, 300);
        dispatch(setTable(data));
    }
}

export function toggleViews(tab) {
    return {
        type: TYPES.TOGGLE_VIEW,
        payload: tab
    };
}

export function setPython(pythonExists) {
    return {
        type: TYPES.PYTHON.SET_EXIST,
        payload: pythonExists
    };
}

export function setPythonInstalled(installed) {
    return {
        type: TYPES.PYTHON.SET_PYTHON_INSTALLED,
        payload: installed
    };
}

export function setPythonInstalling(installing) {
    return {
        type: TYPES.PYTHON.SET_PYTHON_INSTALLING,
        payload: installing
    };
}

export function setCurrentVis(visIndex) {
    return {
        type: TYPES.SET_VISUALIZATION,
        payload: visIndex
    }
}

export function setCurrentTagTab(tabIndex) {
    return {
        type: TYPES.SET_CURRENT_TAG_TAB,
        payload: tabIndex
    }
}

export function setLoading(loading) {
    return {
        type: TYPES.SET_LOADING,
        payload: loading
    };
}

export function setClusterGrammer_URL(url) {
    return {
        type: TYPES.CLUSTERGRAMMER.SET_URL,
        payload: url
    };
}

export function setClusterGrammer_MultView(multView) {
    return {
        type: TYPES.CLUSTERGRAMMER.SET_MULT_VIEW,
        payload: multView
    };
}

export function setClusterGrammer_HeatMap(heatMap) {
    return {
        type: TYPES.CLUSTERGRAMMER.SET_HEAT_MAP,
        payload: heatMap
    };
}

export function setTableActions(tableActions) {
    return {
        type: TYPES.SET_TABLE_ACTIONS,
        payload: tableActions
    };
}

/* 
* Function: genClustergrammer
* Params:
*   > Matrix - matrix of data
*   > installedDepen - whether python dependencies have been installed
*   > Toggle - whether to toggle between heatmap and clustergrammer.
* Description:
*	-> generate clustergrammer mult_view.json.
**/
export function genClustergrammer(ori, installedDepen, toggle) {
    return dispatch => {
        if (installedDepen) {
            dispatch(setPythonInstalled(false));
        }
        if (toggle) {
            dispatch(setPython(true));
        }
        dispatch(setClusterGrammer_MultView(false));
        dispatch(setClusterGrammer_URL(null));

        if (!fs.existsSync(Path.join(remote.app.getPath("temp"), "mosaic"))) {
            fs.mkdirSync(Path.join(remote.app.getPath("temp"), "mosaic"));
            copyDir((Path.join(remote.app.getAppPath(), "helper", "python")), Path.join(remote.app.getPath("temp"), "mosaic"));
        }
        const multViewPath = Path.join(remote.app.getPath('temp'), "mosaic", "mult_view.json");
        const tsvTxtPath = Path.join(remote.app.getPath('temp'), "mosaic", "tsv.txt");
        let tsv = '';
        let row = null;
        let error = false;
        let installing = false;
        const matrix = [];
        const oriSize = ori.length;
        let i = oriSize;
        while (i !== 0) {
            const zeroBaseIndex = oriSize - i;
            matrix.push(ori[zeroBaseIndex]);
            --i;
        }
        for (let i = 0; i < matrix.length; ++i) {
            row = matrix[i].join('\t');
            tsv += i < matrix.length ? `${row}\n` : row;
        }
        fs.writeFile(tsvTxtPath, tsv, () => {
            const python = spawn('python', [Path.join(remote.app.getPath("temp"), "mosaic", "clustergrammer.py"), "-W", "ignore", tsvTxtPath, multViewPath]);
            python.on("error", (err) => {
                alert("No python or Incorrect python version found!");

                error = true;
            });
            python.stderr.on('data', (data) => {
                const erroString = data.toString();
                if (erroString.indexOf("consider upgrading") === -1 && erroString.indexOf("may indicate") === -1) {
                    alert("Cannot run python script for clustergrammer!");
                    error = true;
                    dispatch(setPython(false));
                }
                console.log(erroString);
            });
            python.stdout.on("data", (data) => {
                const message = data.toString();
                console.log(message);
                const ifInstalling = message.indexOf("Collecting");
                const finishedInstalling = message.indexOf("Successfully installed");
                if (ifInstalling !== -1) {
                    installing = true;
                    dispatch(setPythonInstalling(true));
                } else if (finishedInstalling !== -1) {
                    dispatch(setPythonInstalling(false));
                }
            });
            python.on('close', (code) => {
                if (!installing) {
                    if (!error) {
                        const clustergrammerHTMLPath = Path.join(remote.app.getAppPath(), "helper", "clustergram", "index.html");
                        dispatch(setClusterGrammer_URL(clustergrammerHTMLPath));
                        dispatch(setClusterGrammer_MultView(true));
                    } else {
                        dispatch(setPython(false));
                        const heatMap = new Mossy();
                        dispatch(setClusterGrammer_HeatMap(heatMap));
                    }                    
                } else {
                    dispatch(setPythonInstalled(true));
                }
            });
        });
    }
}

/* 
* Function: instantiateHeatMap
* Description:
*	-> instantiate heatMap as a new mossy object.
**/
export function instantiateHeatMap() {
    return dispatch => {
        dispatch(setPython(false));
        const heatMap = new Mossy();
        dispatch(setClusterGrammer_HeatMap(heatMap));
    }
}

/* 
* Function: genHeatMap
* Description:
*	-> generate heatmap using d3.
**/
export function genHeatMap(ori, parent, heatmap) {
    return dispatch => {
        let tmpHeatMap = heatmap;
        const matrix = [];
        const oriSize = ori.length;
        let i = oriSize;
        if (!tmpHeatMap) {
            tmpHeatMap = new Mossy();
            dispatch(setClusterGrammer_HeatMap(tmpHeatMap));
        }
        while (i !== 0) {
            const zeroBaseIndex = oriSize - i;
            matrix.push(ori[zeroBaseIndex]);
            --i;
        }
        tmpHeatMap.heatMap(matrix, {
            d3: d3,
            parent: parent
        });
    }
}