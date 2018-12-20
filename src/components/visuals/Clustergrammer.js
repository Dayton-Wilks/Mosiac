/** ****************************************************************************
/* Name: Lake Sain-Thomason
/* email: lakes@flowjo.com
/* Date: 9/13/17
/* Description: This file makes a post request to the website that hosts the
/* clustergram that we want. This is a TEMPORARY fix. Making a post request
/* to this site in a production environment is NOT sustainable. The solution
/* to this is to download the source files from somewhere in
/* https://www.npmjs.com/package/clustergrammer The reason we are not currently
/* using the source files is because the backend to the clustergrammer relies
/* on python files, which means that either every user needs a python
/* interpreter on their machine, or mosaic needs to be hosted on a server
/* with a python interpreter. The workaround is this, making post requests to
/* the site that owns the clustergrammer
***************************************************************************** */
import React from 'react';
import { genClustergrammer,setCurrentVis } from '../../ReduxStore/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import "./Clustergrammer.css";
import { remote} from "electron";
import {join} from "path";

class Clustergrammer extends React.Component {
  constructor(props) {
    super(props);
    this.simpleheatmap = React.createRef();
  }

  componentDidMount() {
    let doc = document.getElementById('Clustergrammer');
    doc.src = 'static/images/mossy.png';
    doc.title = 'Heatmap';
    //document.getElementById('Clustergrammer').src = 'static/images/mossy.png';

    if (this.props.matrix.length > 1) {
      if(this.props.PYTHON) {
        this.props.genClustergrammer(this.props.matrix);
      }
    }
  }

  shouldComponentUpdate(nextProps, nextStates) {
    if (nextProps.matrix !== this.props.matrix) {
      if (nextProps.matrix.length > 1 && nextProps.PYTHON) {
          nextProps.genClustergrammer(nextProps.matrix);
      }
    }
    if (nextProps.INSTALLED_DEPENDENCIES !== this.props.INSTALLED_DEPENDENCIES && nextProps.INSTALLED_DEPENDENCIES) {
      if (nextProps.matrix.length > 1) {
        nextProps.genClustergrammer(nextProps.matrix, true);
      }
    }
    return (nextProps !== this.props);
  }

  render() {
    if (this.props.matrix.length <= 1) {
      return (
        <div className="invalid">
          No data or Invalid Data!
      </div>
      )
    }
    else if (this.props.INSTALLING_DEPENDENCIES) {
      return (
        <div className="installing">
          Installing Python Dependencies...
        </div>
      )
    } else if (this.props.LOADING) {
      return (
        <div className="loading">
          Loading...
        </div>
      )
    } else if (!this.props.PYTHON && !this.props.LOADING) {
      this.props.setCurrentVis('HeatMap');
      return (
        <div></div>
      );
    } else if (this.props.VISUAL.multView && this.props.PYTHON){
      return (
        <div id="clusterGrammerID" className="clustergrammer">
          <iframe className="clustergrammerFrame" src={this.props.VISUAL.URL + "?path=" + join(remote.app.getPath('temp'), "mosaic", "mult_view.json")} frameBorder="0" />
        </div>
      )
    } else {
      return (
        <div>
          Loading
        </div>
      )
    }
  }
}

export default connect(
	(state) => ({
    VISUAL: state.clusterGrammer, 
    LOADING: state.loading,
    PYTHON: state.python.exist,
    INSTALLING_DEPENDENCIES: state.python.pythonInstalling,
    INSTALLED_DEPENDENCIES: state.python.pythonInstalled,
  }),
  (dispatch) => bindActionCreators({genClustergrammer, setCurrentVis}, dispatch)
)(Clustergrammer);
