import React from 'react';
import PropTypes from 'prop-types';
import { rgb } from 'd3-color';

import { isHiddenRibbon } from './utils/utils';

var Ribbons = function Ribbons(_ref) {
    var chords = _ref.chords,
        color = _ref.color,
        ribbon = _ref.ribbon,
        mouseOverGroup = _ref.mouseOverGroup;
    return React.createElement(
        'g',
        {
            className: 'ribbons',
            fillOpacity: '0.67'
        },
        chords.map(function (chord, chordIndex) {
            return React.createElement('path', {
                key: chordIndex,
                style: { opacity: '' + (isHiddenRibbon(mouseOverGroup, chord.source.index, chord.target.index) ? '0.15' : '0.75')},
                fill: color(chord.target.index),
                stroke: '' + rgb(color(chord.target.index)).darker(),
                d: '' + ribbon({ source: chord.source, target: chord.target })
            });
        })
    );
};

Ribbons.propTypes = process.env.NODE_ENV !== "production" ? {
    chords: PropTypes.array.isRequired,
    color: PropTypes.func.isRequired,
    ribbon: PropTypes.func.isRequired,
    mouseOverGroup: PropTypes.number
} : {};

export default Ribbons;
