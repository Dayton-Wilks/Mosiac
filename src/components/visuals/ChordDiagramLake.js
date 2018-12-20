/** ****************************************************************************
/* Name: Lake Sain-Thomason
/* email: lakes@flowjo.com
/* Date: 08/26/2017
/* Description: Creates the chord diagram
/*
/* Modified By: Dayton Wilks
***************************************************************************** */
import electron from 'electron';
import React from 'react';
import PropTypes from 'prop-types';
import ReactChordDiagram from '../../../lib/react-chord-diagram';

const colorChoice = [
  '#9e0142',
  '#d53e4f',
  '#f46d43',
  '#fdae61',
  '#fee08b',
  '#ffffbf',
  '#e6f598',
  '#abdda4',
  '#66c2a5',
  '#3288bd',
  '#5e4fa2',
];

class ChordDiagram extends React.Component {
  constructor(props) {
    super(props);

    this.state = {loading: true};
    
    this.eventListener_sizeChange = this.eventListener_sizeChange.bind(this);
  }

  /* componentDidMount - Adds size change listener to window && triggers visual to load and fit screen */
  componentDidMount() {
    electron.remote.getCurrentWindow().addListener('resize', this.eventListener_sizeChange);
    this.eventListener_sizeChange();
  }

  /* componentWillUnmount - removes size change listener */
  componentWillUnmount() {
   electron.remote.getCurrentWindow().removeListener('resize',  this.eventListener_sizeChange)
  }

  /* Function: eventListener_sizeChange
  *  Purpose: checks if visual needs to be resized and waits till the screen has stopped resizing to load.
  *  Arguments: None
  *  return: None 
  * */
  eventListener_sizeChange() {
    let doc = document.getElementById(this.props.parent);
    if (this.state.height == doc.offsetHeight && this.state.width == doc.offsetWidth) return;

    if (this.state.loading !== false && this.timeout != null) {
      clearTimeout(this.timeout);
    }
    else {
      this.setState({loading: true});
    }

    this.timeout = setTimeout(() => {
      this.timeout = null;
      let doc = document.getElementById(this.props.parent);
      this.setState({loading: false, height:doc.offsetHeight, width:doc.offsetWidth});
    }, 500);
  }
 

  render() {
    if (this.state.loading !== false) {
      return (<div style={{margin:'auto'}}>Loading...</div>);
    }
    
    let min = Math.min(this.state.height, this.state.width);
    return (
    <ReactChordDiagram
      matrix={this.props.data.matrix}
      componentId={1}
      groupLabels={this.props.data.groupTags}
      groupColors={colorChoice}
      padAngle={0.0}
      height={this.state.height}
      width={this.state.width}
      outerRadius={min * .4}
      style={{ fontSize: Math.max(min/90, 12) + 'px' }}
    />);
  }
}

ChordDiagram.defaultProps = {
  timeout: false,
  parent: "graphViewVisualDiv"
};

ChordDiagram.propTypes = {
  timeout: PropTypes.bool,
  parent: PropTypes.string
};

export default ChordDiagram;