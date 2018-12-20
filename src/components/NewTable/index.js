/* Author: Dayton Wilks
*  Email: daytonw@flowjo.com
*  Date: 8/22/18
*  Description: Create a handsontable that will update it's changes back to the store
*/
import React from 'react';
import { connect } from 'react-redux';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';
import { updateTable, setTable, setFile, setTableActions } from '../../ReduxStore/actions';
import { TableLoading } from "../loading";
import './style.css';
import { bindActionCreators } from 'redux';
import { openMOS, openCSV } from '../../helper/func/openFile';
import Path from 'path';
import { remote } from 'electron';

class table extends React.Component {

  constructor(props) {
    super(props);
    this.actionListener_fauxHeaderHighlights = this.actionListener_fauxHeaderHighlights.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
  }

  componentDidMount() {
    let instance = this.props.getHotInstance().hotInstance;

    if (instance.selectCell) { // Gives focus to table after returing from graph view
      setTimeout(() => {
        try { instance.selectCell(0, 0); }
        catch (e) { console.log('If you see this, it\'s expected\n', e); }
      }, 10);
    }

    let undoRedo = this.props.getHotInstance().hotInstance.undoRedo;
    if (undoRedo) { // restores redo/undo history from store
      undoRedo.undoneActions = this.props.tableActions.undoneActions;
      undoRedo.doneActions = this.props.tableActions.doneActions;
    }
  }

  componentWillUnmount() {
    this.props.setTable(this.props.getHotInstance().hotInstance.getData()); // saves all changes to store

    let instance = this.props.getHotInstance().hotInstance.undoRedo;
    if (instance) { // Saves redo/undo history of table to store
      this.props.setTableActions({
        doneActions: instance.doneActions,
        undoneActions: instance.undoneActions
      });
    }
  }

  /* Function: actionListener_fauxHeaderHighlights
  *  Purpose: When the left and top most cells are clicked, highligh row/col.
  *     When the 0,0 cell is clicked with altKey pressed, select row instead.
  *     Intended for use with handsontable click events.
  *  Returns: N/A                                                           */
  actionListener_fauxHeaderHighlights(event, coords, TD) {
    if (event.altKey) { // check for alt key and 0,0 cell, if so, highlight row
      if (coords.row == 0 && coords.col == 0) {
        this.props.getHotInstance().hotInstance.selectRows(parseInt(coords.row), parseInt(coords.row));
        return;
      }
    }

    if (coords.row == 0) { // if col tag, select col
      this.props.getHotInstance().hotInstance.selectColumns(parseInt(coords.col), parseInt(coords.col));
    }
    else if (coords.col == 0) { // if row tag, select row
      this.props.getHotInstance().hotInstance.selectRows(parseInt(coords.row), parseInt(coords.row));
    }
  }

  /* Function: negativeValueRenderer
  *  Purpose: renderer that adds the cellInvalidData css class to invalid cell.
  *     Colors the cell.
  *  Returns: N/A                                                           */
  negativeValueRenderer(instance, td, row, col, prop, value, cellProperties) {
    td.innerHTML = value;
    if (row >= 2 && col >= 2) {
      if (isNaN(value) || value === '' || value === null) {
        if (!td.classList.contains('cellInvalidData')) {
          td.classList.add("cellInvalidData");
        }
      }
    }
  }

    /* Function: negativeValueRenderer
  *  Purpose: Handles file drops onto the table. If multiple files selected, 
  *     uses the first. Only uses csv and mos file types. Otherwise alerts.
  *  Returns: N/A                                                           */
  handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    let files = e.dataTransfer.files;
    if (files.length == 0) { alert('No files selected'); return false; }
    else if (files.length > 1) alert('More than one file selected. Opening the first one.');

    let extension = files[0].name.substring(files[0].name.lastIndexOf('.'));
    switch (extension) {
      case '.mos': {
        let mosCllbck = (state, filePath) => {
          this.props.updateTable(state.tableData);
          this.props.setFile(filePath.substring(filePath.lastIndexOf(Path.sep) + 1));
          remote.getCurrentWindow().setTitle("Mosaic - " + filePath.substring(filePath.lastIndexOf(Path.sep) + 1));
        }
        openMOS(files[0].path, mosCllbck);
        break;
      }
      case '.csv': {
        let csvCllbck = (data, filePath) => {
          this.props.updateTable(data);
          this.props.setFile(filePath.substring(filePath.lastIndexOf(Path.sep) + 1));
          remote.getCurrentWindow().setTitle("Mosaic - " + filePath.substring(filePath.lastIndexOf(Path.sep) + 1));
        };
        openCSV(files[0].path, csvCllbck);
        break;
      }
      default: {
        alert('Invalid file type');
        return false;
      }
    }

    return true;
  }

  handleDragOver(e) { // Keeps event from reaching other components
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
  render() {
    if (this.props.loading) {
      return <TableLoading />;
    }
    return (
      <div id={'tableBox'}
        onDrop={this.handleDrop}
        onDragOver={this.handleDragOver}
      >
        <HotTable id='hot'
          ref={node => { if (node) { this.props.setHotInstance(node) }; }} // Sets reference for other parts of the application to use
          data={this.props.tableData} // sets the table data. Currently acts directly upon store data. (this is not redux standard)
          contextMenu={true}
          viewportColumnRenderingOffset={200} // Number of col to render at once
          viewportRowRenderingOffset={200}
          fixedRowsTop={2} // sets the number of fixed rows in the table
          fixedColumnsLeft={2}
          stretchH={"all"} // Tells the table to stretch. NOTE: very finicky with certain CSS attributes in parent components.
          afterOnCellMouseDown={this.actionListener_fauxHeaderHighlights}
          outsideClickDeselects={false} // Keeps the table from losing focus
          renderer={this.negativeValueRenderer}
        />
      </div>
    );
  }
}

const mapStoreToProps = store => {
  return {
    tableData: store.tableData,
    loading: store.loading,
    tableActions: store.tableActions,
    tab: store.tab
  };
}

const mapDispatchToActions = dispatch => {
  return bindActionCreators({
    setTable,
    setFile,
    updateTable,
    setTableActions
  }, dispatch)
}

export default connect(mapStoreToProps, mapDispatchToActions)(table);

