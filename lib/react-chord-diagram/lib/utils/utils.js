"use strict";

exports.__esModule = true;
/* Determines what ribbons should be hidden while mousing over a group */
var isHiddenRibbon = exports.isHiddenRibbon = function isHiddenRibbon(mouseOverGroup, sourceIndex, targetIndex) {

    return mouseOverGroup !== null ? mouseOverGroup !== sourceIndex && mouseOverGroup !== targetIndex : false;
};