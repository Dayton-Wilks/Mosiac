import React from 'react';
import PropTypes from 'prop-types';

var Svg = function Svg(_ref) {
    var width = _ref.width,
        height = _ref.height,
        style = _ref.style,
        className = _ref.className,
        children = _ref.children;
    return React.createElement(
        'svg',
        { width: width, height: height, style: style, className: className },
        React.createElement(
            'g',
            { transform: 'translate(' + width / 2 + ',' + height / 2 + ')' },
            children
        )
    );
};

Svg.propTypes = process.env.NODE_ENV !== "production" ? {
    width: PropTypes.number,
    height: PropTypes.number,
    style: PropTypes.object,
    children: PropTypes.arrayOf(PropTypes.node)
} : {};

export default Svg;