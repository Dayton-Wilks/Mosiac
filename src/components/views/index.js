/** ****************************************************************************
/* Name: Isaac Harries
/* email: isaach@flowjo.com
/* Date: 09/20/2017
/* Description: Container for both Table and Graph Views tabs and content
***************************************************************************** */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'underscore';
import { toggleViews } from '../../ReduxStore/actions';
import GraphView from './graphView';
import HotTable from '../NewTable';
import './style.css'

/******************************************************************************
* Function: getViews
* Description: Returns either the TableViews or GraphViews component based on
* which tab is selected
* Parameters: String
* Returns:  Either the content of the tab or an error
*************************************************************************** */
const getView = (selectedTab = 'SHOW_TABLE', setHotInstance, getHotInstance) => {
  switch (selectedTab) {
    case 'SHOW_TABLE':
      return <HotTable setHotInstance={setHotInstance} getHotInstance={getHotInstance} />
    case 'SHOW_GRAPH':
      return (
          <GraphView />
      );
    default:
      throw new Error(`Unknown tab ${selectedTab} selected`);
  }
};

const Tabs = (props) => {
  let tableTab = null;
  let graphTab = null;
  let selectedColor = 'white';
  let otherColor = '#A7AEAC';

  return (
    <div id='MosaicViewContainer'>
      <div className="mosaicTabBar">
        <div id="mosaicTableTab" ref={node => { tableTab = node }}
          className="mosaicPageTab"
          onClick={(e) => {
            props.toggleViews('SHOW_TABLE');
            tableTab.style.backgroundColor = selectedColor;
            graphTab.style.backgroundColor = otherColor;
          }}>
          <a> Table </a>
        </div>
        <div id="mosaicGraphTab" ref={node => { graphTab = node; }}
          className="mosaicPageTab"
          onClick={(e) => {
            props.toggleViews('SHOW_GRAPH');
            tableTab.style.backgroundColor = otherColor;
            graphTab.style.backgroundColor = selectedColor;
          }}>
          <a> Graph </a>
        </div>
      </div>
      {getView(props.tab, props.setHotInstance, props.getHotInstance)}
    </div>
  );
};

Tabs.propTypes = {
  tab: PropTypes.object,
  toggleViews: PropTypes.func,
};

Tabs.defaultProps = {
  tab: null,
  toggleViews: _.noop,
};

const mapStateToProps = state => ({
  tab: state.tab
});

const mapDispatchToProps = { toggleViews };

const VisibleView = connect(mapStateToProps, mapDispatchToProps)(Tabs);

export default VisibleView;