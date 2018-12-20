'use strict';

exports.__esModule = true;
exports.default = undefined;

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _d3Shape = require('d3-shape');

var _d3Chord = require('d3-chord');

var _d3Scale = require('d3-scale');

var _d3Array = require('d3-array');

var _Svg = require('./Svg');

var _Svg2 = _interopRequireDefault(_Svg);

var _Groups = require('./Groups');

var _Groups2 = _interopRequireDefault(_Groups);

var _Ribbons = require('./Ribbons');

var _Ribbons2 = _interopRequireDefault(_Ribbons);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

        var d3Chord = (0, _d3Chord.chord)().padAngle(padAngle).sortGroups(sortGroups).sortSubgroups(sortSubgroups).sortChords(sortChords);

        var chords = d3Chord(matrix);

        var d3Arc = (0, _d3Shape.arc)().innerRadius(innerRadius).outerRadius(outerRadius);

        var d3Ribbon = (0, _d3Chord.ribbon)().radius(innerRadius);

        var color = (0, _d3Scale.scaleOrdinal)().domain((0, _d3Array.range)(groupColors.length)).range(groupColors);

        return _react2.default.createElement(
            _Svg2.default,
            {
                width: width,
                height: height,
                style: style,
                className: className
            },
            _react2.default.createElement(_Groups2.default, {
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
            _react2.default.createElement(_Ribbons2.default, {
                chords: chords,
                color: color,
                ribbon: d3Ribbon,
                mouseOverGroup: this.state.mouseOverGroup
            })
        );
    };

    return ChordDiagram;
}(_react.Component), _class.defaultProps = {
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
    sortSubgroups: _d3Array.descending,
    sortChords: null,
    labelColors: ['#000000'],
    disableHover: false
}, _temp);
exports.default = ChordDiagram;
ChordDiagram.propTypes = process.env.NODE_ENV !== "production" ? {
    matrix: _propTypes2.default.array.isRequired,
    componentId: _propTypes2.default.number.isRequired,
    width: _propTypes2.default.number,
    height: _propTypes2.default.number,
    style: _propTypes2.default.object,
    className: _propTypes2.default.string,
    outerRadius: _propTypes2.default.number,
    innerRadius: _propTypes2.default.number,
    groupLabels: _propTypes2.default.array,
    groupColors: _propTypes2.default.array,
    padAngle: _propTypes2.default.number,
    sortGroups: _propTypes2.default.func,
    sortSubgroups: _propTypes2.default.func,
    sortChords: _propTypes2.default.func,
    labelColors: _propTypes2.default.array,
    disableHover: _propTypes2.default.bool
} : {};
module.exports = exports['default'];