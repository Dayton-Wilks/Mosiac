/** ****************************************************************************
/* Name: Lake Sain-Thomason
/* email: lakes@flowjo.com
/* Date: 09/7/2017
/* Description: Creates the tag selector, which is mainly inline css and ternary
/* operators. sorry
***************************************************************************** */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setCurrentTagTab } from '../../ReduxStore/actions';
import './style.css';

class TagSelector extends Component {
  constructor(props) {
    super(props);
    this.chooseView = this.chooseView.bind(this);
    this.columnTabClicked = this.columnTabClicked.bind(this);
    this.rowTabClicked = this.rowTabClicked.bind(this);
    this.createTagButtons = this.createTagButtons.bind(this);

    this.separatorStyle = [{left: 13, width: 132}, {left: 102, width: 131}];
    this.buttonColors = [{backgroundColor:'#FFFFFF', color:'black'}, {backgroundColor:'#9DB2AA', color:'white'}];

    this.state = {
      rowSelected: this.props.TagTab,
      rowTags: props.array.rowTags,
      columnTags: props.array.columnTags,
    };
  }

  // event handler that drives which tab is displayed
  columnTabClicked() {
    this.setState({ rowSelected: false });
    this.props.setCurrentTagTab(false);
  }

  // event handler that drives which tab is displayed
  rowTabClicked() {
    this.setState({ rowSelected: true });
    this.props.setCurrentTagTab(true);
  }


  /** **************************************************************************
  * Function: createTagButtons
  * Description: creates the buttons and spacing divs from the tags set in
  * the datagrid
  * Parameters:
  * Returns: All of the buttons that were pushed into an array
  *************************************************************************** */
  createTagButtons() {
    const setTags = this.state.rowSelected ? 
      this.state.rowTags : this.state.columnTags;

    const arr = [];
    for (let i = 0; i < setTags.getUserSetTags().length; i += 1) {
      arr.push(
        <div key={i}>
          <img alt='visibility' 
            className='visibilityImage' 
            src={setTags.getUserSetTags()[i].visible ? "static/images/eye.png" : "static/images/grayhide.png"}
            onClick={() => {
              setTags.toggleVisible(setTags.getUserSetTags()[i].tagName);
              this.props.updateTags();
            }}
          />
          <button
            className={'tagButton'}
            style={this.buttonColors[setTags.getUserSetTags()[i].enabled ? 1 : 0]}
            onClick={() => {
              setTags.toggleEnable(setTags.getUserSetTags()[i].tagName);
              this.props.updateTags();
              this.state.rowSelected
                ? this.setState({ rowTags: setTags })
                : this.setState({ columnTags: setTags });
            }}
          >
            {setTags.getUserSetTags()[i].tagName}
          </button>
        </div>,
      );
    }

    return (
      <div id='tagButtonList'>
        {arr}
      </div>
    );
  }

  /** **************************************************************************
  * Function: chooseView
  * Description: Decides what will be shown in the tagselector based off which
  * tab is selected. Uses zIndex and ternary operators to accomplish this
  * Parameters: NA
  * Returns: NA
  *************************************************************************** */
  chooseView() {
    return (
      <div id='tagSelectorDiv'>
        <button
          id='tabSelectorRowButton'
          className='tabSelectorTab'
          onClick={this.rowTabClicked}
          style={{
            zIndex: this.state.rowSelected ? 4 : 3,
          }}>
          Rows
        </button>

        <button
          id='tabSelectorColButton'
          className='tabSelectorTab'
          onClick={this.columnTabClicked}
          style={{ 
            zIndex: this.state.rowSelected ? 3 : 4,
          }}>
          Columns
        </button>

        <div 
          id='tabSelectorDividerBar'
          style={
            this.separatorStyle[this.state.rowSelected ? 1 : 0]
          }
        />
        {this.createTagButtons()}
      </div>
    );
  }

  render() {
    return this.chooseView();
  }
}

const mapStateToProps = state => {
  return { 
    TagTab: state.TagTab 
  };
}

const mapDispatchToProps = dispatch => {
  return {
    setCurrentTagTab: (arg) => dispatch(setCurrentTagTab(arg)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TagSelector);