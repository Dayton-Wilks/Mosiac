/*
* Author: Jiawei Xu
* File: index.js
* Description:
* -> Table preview for stitching window.
*/

import React from "react";
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';

class Preview extends React.Component {
    constructor(props) {
        super(props);
        this.check = React.createRef();
        this.actionListener_fauxHeaderHighlights = this.actionListener_fauxHeaderHighlights.bind(this);
    }
    actionListener_fauxHeaderHighlights(event, coords, TD) {
        if (event.altKey) {
            if (coords.row == 0 && coords.col == 0) {
              this.check.current.hotInstance.selectRows(parseInt(coords.row), parseInt(coords.row));
              return;
            }
          }
          if (coords.row == 0) {
            this.check.current.hotInstance.selectColumns(parseInt(coords.col), parseInt(coords.col));
          }
          else if (coords.col == 0) {
            this.check.current.hotInstance.selectRows(parseInt(coords.row), parseInt(coords.row));
          }
    }
    negativeValueRenderer(instance, td, row, col, prop, value, cellProperties) {
        td.innerHTML = value;
        if (row >= 2 && col >= 3) {
          if (isNaN(value) || value === '' || value === null) {
            if (!td.classList.contains('cellInvalidData')) {
              td.classList.add("cellInvalidData");
            }
          }
        }
        if (row === 0 && col === 0) {
            cellProperties.readOnly = true;
        } else if (row === 1 && col === 0) {
            cellProperties.readOnly = true;
        } else if (row === 0 && col === 1) {
            cellProperties.readOnly = true;
        } else if (row === 0 && col === 2) {
            cellProperties.readOnly = true;
        }
    }
    componentDidMount() {
        this.props.setHotInstance(this.check.current.hotInstance);
    }
    render() {
        return (
            <div className={'preview'}>
                <HotTable   
                    ref={this.check}
                    colHeaders={false}
                    rowHeaders={false}
                    data={this.props.DATA} 
                    manualRowResize={true}
                    manualColumnResize={true} 
                    fixedColumnsLeft={3}
                    fixedRowsTop={2}
                    contextMenu={true}
                    afterOnCellMouseDown={this.actionListener_fauxHeaderHighlights}
                    outsideClickDeselects={false}
                    renderer={this.negativeValueRenderer}
                    stretchH={'all'} />
            </div>
        )
    }
}

export default Preview;