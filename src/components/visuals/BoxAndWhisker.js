/********************************************************************
 * Author: Morgan Loring
 * Email: morganl@flowjo.com
 * Purpose: Component that adds a box and whisker plot to mosaic
 */


import React from 'react';
import exploding_boxplot from '../../../lib/boxAndWhisker/boxAndWhisker';
import './BoxAndWhisker_Style.css';
import * as d3 from 'd3';

class BoxAndWhisker extends React.Component {
    constructor(props) {
        super(props);
        this.makeBox = this.makeBox.bind(this);
        this.flipState = this.flipState.bind(this);
        this.state = { bool: false };
    }

    //function: componentDidMount
    //purpose: calls the make box function after the render method is 
    //          called the first time. I wrote it this way because the 
    //          box plot generator takes an element id as a parameter to add
    //          the box elements to. So a div needs to be created before the
    //          boxes can be added
    //parameters: N/A
    componentDidMount() {
        if (this.props.data.length > 0) {
            this.makeBox(this.props.data);
        }
    }

    //function: shouldComponentUpdate
    //purpose: Used to determine whether or not a compnent should update.
    //         If the props change, then we update
    //parameters: the potentially new properties 
    shouldComponentUpdate(nextProps) {
        if (this.props !== nextProps) {

            this.makeBox(nextProps.data);

            return true;
        }
        else { return false; }
    }

    //function: componentWillUnmount
    //purpose: Removes the tool tips from the body when the
    //          component will be un-mounted. I tried putting the
    //          tool tips in the g.boxcontent but they didn't work right
    //parameters: N/A
    componentWillUnmount() {
        d3.selectAll('div.d3-exploding-boxplot.tip').remove();
    }

    //function: flipState
    //purpose: Used to make react re-render the component. Components
    //          are only re-rendered when the component has a state change.
    //          So I added a bool and flip it when I need to re-render
    //parameters: N/A
    flipState() {
        this.setState({ bool: !this.state.bool });
    }

    //function: makeBox
    //purpose: Creates the boxes and adds them to the html document. Calls 
    //flipState to make it re-render
    //parameters: data: 2-d array of data. A box is made for each column
    makeBox(data) {
        d3.selectAll('.explodingBoxPlot').remove();
        d3.selectAll('div.d3-exploding-boxplot.tip').remove();

        if (data) {
            exploding_boxplot(data, { y: 'Value', group: 'g', color: 'g', label: 'pt' });

            this.flipState();
        }
    }

    render() {
        return (
            <div id='boxAndWhiskerDiv'></div>
        );
    }
}

export default BoxAndWhisker