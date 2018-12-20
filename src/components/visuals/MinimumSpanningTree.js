/*********************************************************************
 * Author: Morgan Loring
 * Email: morganl@flowjo.com
 * File Name: MinimumSpanningTree.js
 * Purpose: React component for the MST visual.
*********************************************************************/
import React from 'react';
import { makeGraph, makeMSTNodes, normalizeData } from '../../../lib/MST/MSTHelper';
import * as d3 from 'd3';
import './MinimumSpanningTree.css';

import mst from '../../../lib/MST/MST';

class MST extends React.Component {
    constructor(props) {
        super(props);
        this.calcMST = this.calcMST.bind(this);
        this.flipState = this.flipState.bind(this);

        this.state = { bool: false };
    }



    /*********************************************************************
     * calcMST
     * 
     * purpose: Calls all of the helper methods to make the MST then passes 
     *      the data to the d3 visualization.
     * 
     * Parameters: props: data object that is either this.props or newProps
     *      that comes from the shouldComponentUpdate method. Contains a 
     *      2d array of table data and an array of the selected columns
    *********************************************************************/
    calcMST(props) {
        if (props.data.length > 1) {
            var primsMST = makeGraph(props);

            var d3MSTNodes = makeMSTNodes(props.data);

            var d3MSTEdges = normalizeData(primsMST);

            mst(d3MSTNodes, d3MSTEdges);

            this.flipState();
        }
    }

    /*********************************************************************
     * componentDidMount
     * 
     * purpose: Called by react after the render method to. This is here to 
     *      pass the props into calcMST. Maybe there is a better way?
     * 
     * Parameters: N/A
    *********************************************************************/
    componentDidMount() {
        if (this.props.data.length > 1) {
            this.calcMST(this.props);
        }
    }

    componentWillUnmount() {
        d3.selectAll('.MST').remove();
        d3.select(window).on('resize', null);
    }

    /*********************************************************************
     * flipState 
     * 
     * purpose: used to force react to re-render. React only re-renders when 
     *      there is a state change. Hence the flipping of this boolean
     * 
     * Parameters: N/A
    *********************************************************************/
    flipState() {
        this.setState({ bool: !this.state.bool })
    }

    /*********************************************************************
     * shouldComponentUpdata
     * 
     * purpose: Returns true if the component should update and false if it
     *      doesn't need to. Calls calcMST if the props are different than 
     *      what the component currently has. 
     * 
     * Parameters: newProps: data object representing the new props. Used to 
     *      determine if a re-render should happen
    *********************************************************************/
    shouldComponentUpdate(newProps) {
        if (this.props !== newProps) {
            d3.selectAll('.MST').remove();
            this.calcMST(newProps);

            return true;
        }

        return false;
    }

    render() {
        return (
            <div id='MST'></div>
        );
    }
}

export default MST;