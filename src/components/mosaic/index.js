/** ****************************************************************************
* Author: Isaac Harries
* email: isaach@flowjo.com
* Date: 09/18/2017
* Description: Main container for all components goes here
*
* Modified by: Jiawei Xu(Kevin)
* Modified by: Dayton Wilks - 8/9/18
***************************************************************************** */

import React from 'react';
import { connect } from "react-redux";
import Menu from '../menus/menu'
import { openCSV } from "../../helper/func/openFile";
import { getAppPath } from "../../helper/func";
import { updateTable,setFile } from "../../ReduxStore/actions";
import path from "path";
import Views from '../views';
import "./style.css";
import { bindActionCreators } from 'redux';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.hotInstance = React.createRef();
    this.setHotInstance = this.setHotInstance.bind(this);
    this.getHotInstance = this.getHotInstance.bind(this);
  }

  setHotInstance(ref) {
    this.hotInstance = ref;
  }

  getHotInstance() {
    return this.hotInstance;
  }

  /** **************************************************************************
  * Function: componentDidMount
  * Description: When the component mounts (renders), add a window event handler
  * for mouse clicks. This is only used for the dropdown menus.
  * Parameters: NA
  * Returns: NA
  *************************************************************************** */
  componentDidMount() {
    openCSV(path.join(getAppPath(), "static", "demo", "demo.csv"), (result) => {
      this.props.updateTable(result);
      this.props.setFile("Demo");
    });
  }

  /** **************************************************************************
  * Function: componentWillUnmount
  * Description: Method equivalent to a destructor in C++. After component
  * unmounts, remove mouse click event listener
  * Parameters: NA
  * Returns NA
  *************************************************************************** */
  componentWillUnmount() {
    window.removeEventListener('click', this.handleClick);
  }

  /** **************************************************************************
  * Function: handleClick
  * Description: Callback for mouse click event listener
  * Parameters: event
  * Returns: NA
  *************************************************************************** */
  handleClick(e) {
    const myDropdowns = document.getElementsByClassName('dropdown-content');

    Array.from(myDropdowns, (dropdown) => {
      if (dropdown !== null && dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
      }
    });

    if (e.target.matches('.dropbtn')) {
      switch (e.target.id) {
        case 'fileMenu':
          document.getElementById('myFileDropdown').classList.toggle('show');
          break;
        case 'editMenu':
          document.getElementById('myEditDropdown').classList.toggle('show');
          break;
        case 'helpMenu':
          document.getElementById('myHelpDropdown').classList.toggle('show');
          break;
        case 'feedbackMenu':
          document.getElementById('myFeedbackDropdown').classList.toggle('show');
          break;
      }
    }
  }


  /** **************************************************************************
  * Function: render
  * Description: This method gets called when the component finishes mounting.
  * It will render all the components contained in the JSX return
  * statement
  * Parameters: NA
  * Returns: JSX (special markup for react (can have a mix of syntax that
  * resembles html and javascript)
  *************************************************************************** */
  render() {
    return (
      <div id="appWindowDiv" onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'none'; }}
        onDrop={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'none'; }}>
        <Menu getHotInstance={this.getHotInstance} />
        <Views setHotInstance={this.setHotInstance} getHotInstance={this.getHotInstance} />
      </div>
    );
  }
}

const mapStateToProps = store => {
  return {
    file: store.file,
    tableData: store.tableData
  };
}

const mapActionsToDispatch = dispatch => {
  return bindActionCreators(
  {
    updateTable,
    setFile
  }, dispatch);
}

export default connect(mapStateToProps, mapActionsToDispatch)(App);