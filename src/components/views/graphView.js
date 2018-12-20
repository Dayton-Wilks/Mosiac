/** ****************************************************************************
/* Name: Lake Sain-Thomason, Isaac Harries
/* email: lakes@flowjo.com, isaach@flowjo.com
/* Date: 09/14/2017
/* Description: File that drives the graph tab in mosaic.
***************************************************************************** */
import React from "react";
import { connect } from "react-redux";
import {
  transform_dataTable,
  setCurrentVis,
  setLoading
} from "../../ReduxStore/actions";
import TagSelector from "./TagSelector";
import Table from "../datastructure/allTags";
import ChordDiagramLake from "../visuals/ChordDiagramLake";
import Clustergrammer from "../visuals/Clustergrammer";
import BoxAndWhisker from "../visuals/BoxAndWhisker";
import MST from "../visuals/MinimumSpanningTree";
import { GraphLoading } from "../loading";
import HeatMap from "../visuals/Heatmap";
import {
  excludeInvalidRowsAndRowTags,
  excludeInvalidColsAndColTags
} from "../../helper/func";
import "./style.css";
import { bindActionCreators } from "redux";

class View extends React.Component {
  constructor(props) {
    super(props);
    this.updateTags = this.updateTags.bind(this);
    this.chooseVis = this.chooseVis.bind(this);
    this.createVisButtons = this.createVisButtons.bind(this);
    this.setCurrVis = this.setCurrVis.bind(this);
    this.state = {
      reload: false
    };
  }

  componentDidMount() {
    if (
      this.props.tableData &&
      this.props.tableData.length > 0 &&
      this.props.tableData[0].length > 0
    ) {
      let test = transform_dataTable(this.props.tableData);
      const ret = excludeInvalidRowsAndRowTags(
        excludeInvalidColsAndColTags(test)
      );
      if (
        test.data.length != ret.data.length ||
        test.rowTags.length != ret.rowTags.length ||
        test.columnTags.length != ret.columnTags.length
      ) {
        alert("Errors exist in data - some data will be excluded");
      }
      this.table = new Table(ret.data);
      let myArr = [];
      for (let i = 0; i < ret.rowTags.length; i += 1) {
        if (ret.rowTags[i]) {
          myArr = [];
          myArr.push(i);
          this.table.rowTags.addTag(ret.rowTags[i], myArr, false);
        }
      }
      for (let i = 0; i < ret.columnTags.length; i += 1) {
        if (ret.columnTags[i]) {
          myArr = [];
          myArr.push(i);
          this.table.columnTags.addTag(ret.columnTags[i], myArr, false);
        }
      }
      this.updateTags();
    }
    setTimeout(() => {
      this.props.setLoading(false);
    }, 800);
  }

  componentWillMount() {
    this.props.setLoading(true);
  }

  shouldComponentUpdate(nextProps, nextStates) {
    let ifUpdate = false;
    if (nextProps !== this.props) ifUpdate = true;
    else if (nextStates !== this.state) ifUpdate = true;
    return ifUpdate;
  }

  // function that is propsed into every visualization thumbnail. Uses thumbnails
  // ID to set the current visualization
  setCurrVis(event) {
    if (
      event.target.id === "Clustergrammer" &&
      this.props.currentVisualization === "Clustergrammer"
    ) {
      this.props.setCurrentVis("HeatMap");
    } else {
      this.props.setCurrentVis(event.target.id);
    }
  }

  /** **************************************************************************
   * Function: chooseVis
   * Description: Simple switch statement that is called in render(). Decides
   * which visualization should be rendered
   * Parameters: None
   * Returns: The visualization component
   *************************************************************************** */
  chooseVis() {
    switch (this.props.currentVisualization) {
      case "ChordDiagram":
        return <ChordDiagramLake data={this.table.createChordDiagramData()} />;
      case "Clustergrammer":
        return (
          <Clustergrammer matrix={this.table.removeNonVisibleTagsFromTable()} />
        );
      case "HeatMap": {
        let test = this.table.removeNonVisibleTagsFromTable();
        if (test.length > 1) return <HeatMap matrix={test} />;
        return <div className="invalid">No data or Invalid Data!</div>;
      }
      case "BoxAndWhisker":
        return <BoxAndWhisker data={this.table.createBoxAndWhiskerMatrix()} />;
      case "MinSpanningTree":
        return (
          <MST
            data={this.table.removeNonVisibleTagsFromTable()}
            selectedTags={this.table.getSelectedAndVisibleTags_Column()}
          />
        );
      default:
        return <div> Invalid Visualization Selection </div>;
    }
  }

  /** **************************************************************************
   * Function: updateTags
   * Description: Callback function that is propsed to the tagSelector objects
   * should be called every time a tag is enabled or disabled.
   * Parameters: None
   * Returns: None
   *************************************************************************** */
  updateTags() {
    this.setState({
      reload: !this.state.reload
    });
  }

  /** **************************************************************************
   * Function: createVisButtons
   * Description: creates and styles the thumbnail icons
   * Parameters: none
   * Returns: The functional thumbnail images
   *************************************************************************** */
  createVisButtons() {
    return (
      <div id="visualSelectionBox">
        <div>
          <img
            id="ChordDiagram"
            title="Chord Diagram"
            className='visualSelectionButton'
            src="static/images/iconsV2PNGchord1.png"
            alt="chord.png"
            onClick={this.setCurrVis}
          />
          <img
            id="Clustergrammer"
            title={this.props.python ? "Clustergrammer" : 'Heatmap'}
            className='visualSelectionButton'
            src={this.props.python ? 'static/images/iconsV2PNGcluster2.png' : 'static/images/mossy.png'}
            alt="cluster.png/heatmap.png"
            onClick={this.setCurrVis}
          />
        </div>

        <div>
          <img
            id="BoxAndWhisker"
            title="Box & Whisker"
            className='visualSelectionButton'
            src="static/images/boxAndWhisker.png"
            alt="boxAndWhisker.png"
            onClick={this.setCurrVis}
          />
          <img
            id="MinSpanningTree"
            title="Minimum Spanning Tree"
            className='visualSelectionButton'
            src="static/images/MST.png"
            alt="MST.png"
            onClick={this.setCurrVis}
          />
        </div>
      </div>
    );
  }

  render() {
    if (this.table && this.table.table.length < 3) {
      return (
        <div className="notEnoughData">Not enough data for visualizations.</div>
      );
    } else if (!this.table && !this.props.loading) {
      return <div className="notEnoughData">No data found!</div>;
    } else if (!this.props.loading && this.table) {
      return (
        <div id="graphViewWindowDiv">
          <div id="graphViewSideBar">
            {this.createVisButtons()}
            <TagSelector
              reload={this.state.reload}
              array={this.table}
              updateTags={this.updateTags}
            />
          </div>

          <div id="graphViewVisualDiv">{this.chooseVis()}</div>
        </div>
      );
    }
    return <GraphLoading />;
  }
}

View.defaultProps = {
  data: null,
  rowTags: null,
  columnTags: null
};

const mapStateToProps = state => {
  return {
    tableData: state.tableData,
    loading: state.loading,
    currentVisualization: state.currentVisualization,
    python: state.python.exist
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      setCurrentVis,
      setLoading
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(View);
