'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _d3Color = require('d3-color');

var _utils = require('./utils/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Ribbons = function Ribbons(_ref) {
    var chords = _ref.chords,
        color = _ref.color,
        ribbon = _ref.ribbon,
        mouseOverGroup = _ref.mouseOverGroup;
    return _react2.default.createElement(
        'g',
        {
            className: 'ribbons',
            fillOpacity: '0.67'
        },
        chords.map(function (chord, chordIndex) {
            return _react2.default.createElement('path', {
                key: chordIndex,
                style: { opacity: '' + ((0, _utils.isHiddenRibbon)(mouseOverGroup, chord.source.index, chord.target.index) ? '0.75' : '0.15')},

                fill: color(chord.target.index),
                stroke: '' + (0, _d3Color.rgb)(color(chord.target.index)).darker(),
                d: '' + ribbon({ source: chord.source, target: chord.target })
            });
        })
    );
};

Ribbons.propTypes = process.env.NODE_ENV !== "production" ? {
    chords: _propTypes2.default.array.isRequired,
    color: _propTypes2.default.func.isRequired,
    ribbon: _propTypes2.default.func.isRequired,
    mouseOverGroup: _propTypes2.default.number
} : {};

exports.default = Ribbons;
module.exports = exports['default'];
