import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { genClustergrammer, genHeatMap, instantiateHeatMap, setCurrentVis } from '../../ReduxStore/actions';

class HeatMap extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        if (this.props.PYTHON) { 
            let doc = document.getElementById('Clustergrammer');
            doc.src = 'static/images/iconsV2PNGcluster2.png';
            doc.title = "Clustergrammer";
        }
        if (this.props.VISUAL.heatMap && this.props.VISUAL.heatMap.ifExist()) {
            this.props.VISUAL.heatMap.clear();
        }
        this.props.genHeatMap(this.props.matrix, "#simpleHeatMap", this.props.VISUAL.heatMap);
    }
    componentWillUnmount() {
        if (this.props.matrix.length > 1) {
            if (this.props.VISUAL.heatMap && this.props.VISUAL.heatMap.ifExist()) {
                this.props.VISUAL.heatMap.clear();
            }
        }
    }
    shouldComponentUpdate(nextProps, nextStates) {
        if (nextProps.matrix !== this.props.matrix) {
            if (nextProps.VISUAL.heatMap) {
                if (nextProps.VISUAL.heatMap.ifExist()) {
                    nextProps.VISUAL.heatMap.clear();
                }
                nextProps.genHeatMap(nextProps.matrix, "#simpleHeatMap", nextProps.VISUAL.heatMap);
            }
        }
    }
    render() {
        return (
            <div className="heatmap">
                <div id="simpleHeatMap" ref={this.simpleheatmap}></div>
            </div>
        )
    }
}
export default connect(
    (store) => ({
        VISUAL: store.clusterGrammer,
        PYTHON: store.python.exist
    }),
    (dispatch) => bindActionCreators({
        genClustergrammer,
        genHeatMap,
        instantiateHeatMap,
        setCurrentVis
    }, dispatch)
)(HeatMap);
