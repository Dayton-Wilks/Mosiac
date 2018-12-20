'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _d3Color = require('d3-color');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    return _react2.default.createElement(
        'g',
        { className: 'groups' },
        chords.groups.map(function (group, groupIndex) {
            return _react2.default.createElement(
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
                _react2.default.createElement('path', {
                    id: 'component' + componentId + '-group' + groupIndex,
                    fill: '' + color(groupIndex),
                    stroke: '' + (0, _d3Color.rgb)(color(groupIndex)).darker(), d: arc(group)
                }),
                _react2.default.createElement(
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
    componentId: _propTypes2.default.number.isRequired,
    chords: _propTypes2.default.array.isRequired,
    color: _propTypes2.default.func.isRequired,
    arc: _propTypes2.default.func.isRequired,
    setMouseOverGroup: _propTypes2.default.func.isRequired,
    groupLabels: _propTypes2.default.array,
    labelColors: _propTypes2.default.array,
    disableHover: _propTypes2.default.bool
} : {};

exports.default = Groups;
module.exports = exports['default'];