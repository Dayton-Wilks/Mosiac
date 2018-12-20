/****************************************************************
 * Morgan Loring
 * morganl@flowjo.com
 * 8/24/18
 * Description: New menu bar for file and edit dropdowns
 ****************************************************************/
import React from "react";
import Path from 'path';
import { connect } from "react-redux";
import { remote, clipboard } from 'electron';
import { bindActionCreators } from "redux";
import { helper } from 'handsontable';
import { setFile, updateTable, setIsStitchWindowActive } from '../../ReduxStore/actions';
import { selectAndOpenFile } from '../../helper/func/openFile';
import { saveFile } from '../../helper/func/saveFile';
import { openStitchingWindow } from '../../helper/stitching';

import "./style.css";
import { transpose } from "../../helper/func";

/*********************************************************************
 * newClick
 * 
 * purpose: Click handler for the New menu option. Sets the redux table to 
 *          an blank 100x100
 * 
 * Parameters: props from the parent component
*********************************************************************/
function newClick(props) {
    props.hideMenu();
    var blankTable = helper.createEmptySpreadsheetData(100, 100);
    blankTable[0][0] = 'TAG';
    blankTable[1][1] = 'HEADER';
    props.updateTable(blankTable);
    props.setFile('* New File *')
    remote.getCurrentWindow().setTitle("Mosaic - * New File *");
}

/*********************************************************************
 * openClick
 * 
 * purpose: Click handler for open button. Launches the open file window, 
 *          calls the function to open data, then loads the data into 
 *          the redux store
 * 
 * Parameters: props from the parent component
*********************************************************************/
function openClick(props) {
    props.hideMenu();
    let newDataCallback = (data, filePath) => {
        var file = filePath.substring(filePath.lastIndexOf(Path.sep) + 1),
            extension = file.substring(file.lastIndexOf('.'));
        switch (extension) {
            case '.csv': {
                props.updateTable(data);
                props.setFile(file)
                break;
            }
            case '.mos': {  //make one action for this?
                props.updateTable(data.tableData);
                props.setFile(file)
                break;
            }
        }
        remote.getCurrentWindow().setTitle("Mosaic - " + file);
    }

    selectAndOpenFile(newDataCallback)
}

/*********************************************************************
 * saveAsClick
 * 
 * purpose: Click handler for the Save As menu option. Saves the table 
 *          data to a file. Either a mos or a csv
 * 
 * Parameters: props from the parent component
*********************************************************************/
function saveAsClick(props) {
    props.hideMenu();
    let handleSave = (filePath) => {
        var file = filePath.substring(filePath.lastIndexOf(Path.sep) + 1);
        props.setFile(file)
        remote.getCurrentWindow().setTitle("Mosaic - " + file);
    }

    saveFile({
        tableData: props.tableData
    }, handleSave);
}

/*********************************************************************
 * undoClick
 * 
 * purpose: Click handler for the undo menu option. Calls the HOT undo
 *          handler
 * 
 * Parameters: props from the parent component
*********************************************************************/
function undoClick(props) {
    props.hideMenu();
    const tableInstance = props.getHotInstance();
    if (tableInstance && tableInstance.hotInstance.isUndoAvailable()) {
        tableInstance.hotInstance.undo();
    }
}

/*********************************************************************
 * redoClick
 * 
 * purpose: Click handler for the redo menu option. Calls the HOT redo
 *          handler
 * 
 * Parameters: props from the parent component
*********************************************************************/
function redoClick(props) {
    props.hideMenu();
    const tableInstance = props.getHotInstance();
    if (tableInstance && tableInstance.hotInstance.isRedoAvailable()) {
        tableInstance.hotInstance.redo();
    }
}

/*********************************************************************
 * cutClick
 * 
 * purpose: Click handler for the cut menu option. Calls the HOT cut
 *          handler
 * 
 * Parameters: props from the parent component
*********************************************************************/
function cutClick(props) {
    props.hideMenu();
    const tableInstance = props.getHotInstance();
    if (tableInstance) {
        const plugin = tableInstance.hotInstance.getPlugin("copyPaste");
        if (plugin) {
            plugin.cut();
        }
    }
}

/*********************************************************************
 * copyClick
 * 
 * purpose: Click handler for the copy menu option. Calls the HOT copy
 *          handler
 * 
 * Parameters: props from the parent component
*********************************************************************/
function copyClick(props) {
    props.hideMenu();
    const tableInstance = props.getHotInstance();
    if (tableInstance) {
        const plugin = tableInstance.hotInstance.getPlugin("copyPaste");
        if (plugin) {
            plugin.copy();
        }
    }
}

/*********************************************************************
 * pasteClick
 * 
 * purpose: Click handler for the paste menu option. Calls the HOT paste
 *          handler
 * 
 * Parameters: props from the parent component
*********************************************************************/
function pasteClick(props) {
    props.hideMenu();
    const tableInstance = props.getHotInstance();
    if (tableInstance) {
        const plugin = tableInstance.hotInstance.getPlugin("copyPaste");
        if (plugin) {
            plugin.paste(clipboard.readText());
        }
    }
}

/*********************************************************************
 * selectAllClick
 * 
 * purpose: Click handler for the select all menu option. Selects all cells 
 *          in the table
 * 
 * Parameters: props from the parent component
*********************************************************************/
function selectAllClick(props) {
    props.hideMenu();
    const tableInstance = props.getHotInstance();
    if (tableInstance) {
        tableInstance.hotInstance.selectAll();
    }
}

/*********************************************************************
 * transposeHandle
 * 
 * purpose: Click handler for the transpose menu option. Transposes the 
 *          table
 * 
 * Parameters: props from the parent component
*********************************************************************/
function transposeHandle(props) {
    let transposedData = transpose(props.tableData);
    props.updateTable(transposedData);
}

const Foptions = React.forwardRef((props, dropDowns) => (
    <ul className="f-options">
        <li id="f-file" className="f-option">
            <span
                option="f-file"
                className="f-option-label"
                onClick={props.menuOnClick}
                onMouseEnter={props.onMenuMouseOver}>
                File
            </span>
            <div ref={dropDowns[0]} className="f-option-dropdown f-hidden" id="fileDropdown">
                <p className="f-menu-item" onClick={newClick.bind(null, props)}>New</p>
                <p className="f-menu-item" onClick={openClick.bind(null, props)}>Open</p>
                <p className="f-menu-item" onClick={saveAsClick.bind(null, props)}>Save as</p>
            </div>
        </li>
        <li id="f-edit" className="f-option">
            <span
                option="f-edit"
                className="f-option-label"
                onClick={props.menuOnClick}
                onMouseEnter={props.onMenuMouseOver}>
                Edit
            </span>
            <div ref={dropDowns[1]} className="f-option-dropdown f-hidden" id="editDropdown">
                <p className="f-menu-item" onClick={undoClick.bind(null, props)}>
                    Undo<img className="f-icon" alt="undo" src="static/images/undo.svg" /></p>
                <p className="f-menu-item" onClick={redoClick.bind(null, props)}>
                    Redo<img className="f-icon" alt="redo" src="static/images/redo.svg" /></p>
                <p className="f-menu-item" onClick={cutClick.bind(null, props)}>
                    Cut<img className="f-icon" alt="cut" src="static/images/cut.svg" /></p>
                <p className="f-menu-item" onClick={copyClick.bind(null, props)}>
                    Copy<img className="f-icon" alt="cut" src="static/images/copy.svg" /></p>
                <p className="f-menu-item" onClick={pasteClick.bind(null, props)}>
                    Paste<img className="f-icon" alt="cut" src="static/images/paste.svg" /></p>
                <p className="f-menu-item" onClick={selectAllClick.bind(null, props)}>
                    Select All</p>
                <p className="f-menu-item" onClick={!props.isStitchWindowActive ? openStitchingWindow.bind(null, props.file, props.tableData, props.setIsStitchWindowActive) : null}>
                    Stitch</p>
                <p className="f-menu-item" onClick={transposeHandle.bind(null, props)}>
                    Transpose</p>
            </div>
        </li>
    </ul>
));

class Frame extends React.Component {
    constructor(props) {
        super(props);
        this.clicked = false;
        this.dropdowns = [
            React.createRef(),
            React.createRef()
        ];
        this.currentDropDown = null;
        this.menuOnClick = this.menuOnClick.bind(this);
        this.onMenuMouseOver = this.onMenuMouseOver.bind(this);
        this.hideMenuHandle = this.hideMenuHandle.bind(this);
    }
    selectDropDown(option) {
        let currentDropDown = null;
        switch (option) {
            case "f-file":
                currentDropDown = this.dropdowns[0].current;
                break;
            case "f-edit":
                currentDropDown = this.dropdowns[1].current;
                break;
            default:
                console.log(option);
        }
        return currentDropDown;
    }
    onMenuMouseOver(e) {
        if (this.clicked) {
            const currentDropDown = this.selectDropDown(
                e.target.getAttribute("option")
            );
            if (currentDropDown) {
                this.currentDropDown.classList.toggle("f-hidden");
                currentDropDown.classList.toggle("f-hidden");
                this.currentDropDown = currentDropDown;
            }
        }
    }
    hideMenuHandle(e) {
        document.removeEventListener('click', this.hideMenuHandle, false);
        this.currentDropDown.classList.toggle('f-hidden');
        this.currentDropDown = null;
        this.clicked = false;
    }
    menuOnClick(e) {
        if (!this.clicked) {
            const currentDropDown = this.selectDropDown(
                e.target.getAttribute("option")
            );
            if (currentDropDown) {
                document.addEventListener('click', this.hideMenuHandle, false);
                currentDropDown.classList.toggle("f-hidden");
                this.currentDropDown = currentDropDown;
                this.clicked = true;
            }
        } else {
            if (this.currentDropDown) {
                document.removeEventListener('click', this.hideMenuHandle, false);
                this.currentDropDown.classList.toggle("f-hidden");
                this.clicked = false;
            }
        }
    }
    render() {

        return (
            <div className="frame">
                <div className={"f-menubar"}>
                    <Foptions 
                        {...this.props} 
                        ref={this.dropdowns} 
                        menuOnClick={this.menuOnClick} 
                        hideMenu={this.hideMenuHandle} 
                        onMenuMouseOver={this.onMenuMouseOver}
                        isStitchWindowActive={this.props.isStitchWindowActive}
                        setIsStitchWindowActive={this.props.setIsStitchWindowActive} />
                </div>
            </div>
        );
    }
}

export default connect((state) => (
    {
        tableData: state.tableData,
        file: state.file,
        isStitchWindowActive: state.isStitchWindowActive
    }), (dispatch) => bindActionCreators({ 
        setFile, 
        updateTable,
        setIsStitchWindowActive }, dispatch))(Frame);