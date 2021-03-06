import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { rgb } from 'd3-color';

var getAngle = function getAngle(group) {
    return (group.startAngle + group.endAngle) / 2;
};

var Groups = function Groups(_ref) {
    var componentId = _ref.componentId,
        chords = _ref.chords,
        color = _ref.color,
        arc = _ref.arc,
        outerRadius = _ref.outerRadius,
        setMouseOverGroup = _ref.setMouseOverGroup,
        groupLabels = _ref.groupLabels,
        labelColors = _ref.labelColors,
        disableHover = _ref.disableHover;
    return React.createElement(
        'g',
        { className: 'groups' },
        chords.groups.map(function (group, groupIndex) {
            return React.createElement(
                'g',
                {
                    key: groupIndex,
                    onMouseOver: !disableHover ? function () {
                        return setMouseOverGroup(group.index);
                    } : null,
                    onMouseOut: !disableHover ? function () {
                        return setMouseOverGroup(null);
                    } : null
                },
                React.createElement('path', {
                    id: 'component' + componentId + '-group' + groupIndex,
                    fill: '' + color(groupIndex),
                    stroke: '' + rgb(color(groupIndex)).darker(), d: arc(group)
                }),
                React.createElement(
                    'text',
                    {
                        dy: '.35em',
                        transform: 'rotate(' + (getAngle(group) * 180 / Math.PI - 90) + ') translate(' + (outerRadius + 10) + ') ' + (getAngle(group) > Math.PI ? "rotate(180)" : ""),
                        fill: labelColors.length === 1 ? labelColors[0] : labelColors[groupIndex],
                        style: { textAnchor: (group.startAngle + group.endAngle) / 2 > Math.PI ? "end" : null }
                    },
                    groupLabels[groupIndex]
                )
            );
        })
    );
};

Groups.propTypes = process.env.NODE_ENV !== "production" ? {
    componentId: PropTypes.number.isRequired,
    chords: PropTypes.array.isRequired,
    color: PropTypes.func.isRequired,
    arc: PropTypes.func.isRequired,
    setMouseOverGroup: PropTypes.func.isRequired,
    groupLabels: PropTypes.array,
    labelColors: PropTypes.array,
    disableHover: PropTypes.bool
} : {};

export default Groups;