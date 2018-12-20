var _class, _temp;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { arc } from 'd3-shape';
import { ribbon, chord } from 'd3-chord';
import { scaleOrdinal } from 'd3-scale';
import { range, descending } from 'd3-array';

import Svg from './Svg';
import Groups from './Groups';
import Ribbons from './Ribbons';

var ChordDiagram = (_temp = _class = function (_Component) {
    _inherits(ChordDiagram, _Component);

    function ChordDiagram(props) {
        _classCallCheck(this, ChordDiagram);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        _this.state = {
            mouseOverGroup: null
        };


        _this.setMouseOverGroup = _this.setMouseOverGroup.bind(_this);
        return _this;
    }

    ChordDiagram.prototype.setMouseOverGroup = function setMouseOverGroup(mouseOverGroup) {

        this.setState({ mouseOverGroup: mouseOverGroup });
    };

    ChordDiagram.prototype.render = function render() {
        var _props = this.props,
            matrix = _props.matrix,
            componentId = _props.componentId,
            width = _props.width,
            height = _props.height,
            style = _props.style,
            className = _props.className,
            groupLabels = _props.groupLabels,
            groupColors = _props.groupColors,
            padAngle = _props.padAngle,
            sortGroups = _props.sortGroups,
            sortSubgroups = _props.sortSubgroups,
            sortChords = _props.sortChords,
            labelColors = _props.labelColors,
            disableHover = _props.disableHover;


        var outerRadius = this.props.outerRadius || Math.min(width, height) * 0.5 - 40;
        var innerRadius = this.props.innerRadius || outerRadius - 30;

        var d3Chord = chord().padAngle(padAngle).sortGroups(sortGroups).sortSubgroups(sortSubgroups).sortChords(sortChords);

        var chords = d3Chord(matrix);

        var d3Arc = arc().innerRadius(innerRadius).outerRadius(outerRadius);

        var d3Ribbon = ribbon().radius(innerRadius);

        var color = scaleOrdinal().domain(range(groupColors.length)).range(groupColors);

        return React.createElement(
            Svg,
            {
                width: width,
                height: height,
                style: style,
                className: className
            },
            React.createElement(Groups, {
                componentId: componentId,
                chords: chords,
                color: color,
                arc: d3Arc,
                outerRadius: outerRadius,
                setMouseOverGroup: this.setMouseOverGroup,
                groupLabels: groupLabels,
                labelColors: labelColors,
                disableHover: disableHover
            }),
            React.createElement(Ribbons, {
                chords: chords,
                color: color,
                ribbon: d3Ribbon,
                mouseOverGroup: this.state.mouseOverGroup
            })
        );
    };

    return ChordDiagram;
}(Component), _class.defaultProps = {
    matrix: [],
    componentId: 1,
    width: 700,
    height: 700,
    style: {},
    className: '',
    outerRadius: null,
    innerRadius: null,
    groupLabels: [],
    groupColors: [],
    padAngle: 0.05,
    sortGroups: null,
    sortSubgroups: descending,
    sortChords: null,
    labelColors: ['#000000'],
    disableHover: false
}, _temp);
export { ChordDiagram as default };
ChordDiagram.propTypes = process.env.NODE_ENV !== "production" ? {
    matrix: PropTypes.array.isRequired,
    componentId: PropTypes.number.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    style: PropTypes.object,
    className: PropTypes.string,
    outerRadius: PropTypes.number,
    innerRadius: PropTypes.number,
    groupLabels: PropTypes.array,
    groupColors: PropTypes.array,
    padAngle: PropTypes.number,
    sortGroups: PropTypes.func,
    sortSubgroups: PropTypes.func,
    sortChords: PropTypes.func,
    labelColors: PropTypes.array,
    disableHover: PropTypes.bool
} : {};