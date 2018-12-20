'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Svg = function Svg(_ref) {
    var width = _ref.width,
        height = _ref.height,
        style = _ref.style,
        className = _ref.className,
        children = _ref.children;
    return _react2.default.createElement(
        'svg',
        { width: width, height: height, style: style, className: className },
        _react2.default.createElement(
            'g',
            { transform: 'translate(' + width / 2 + ',' + height / 2 + ')' },
            children
        )
    );
};

Svg.propTypes = process.env.NODE_ENV !== "production" ? {
    width: _propTypes2.default.number,
    height: _propTypes2.default.number,
    style: _propTypes2.default.object,
    children: _propTypes2.default.arrayOf(_propTypes2.default.node)
} : {};

exports.default = Svg;
module.exports = exports['default'];