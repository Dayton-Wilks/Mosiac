/*
* Author: Jiawei Xu
* File: index.js
* Description:
*   -> Loading screens for table and graph.
*/

import React from "react";
import "./style.css";

export const TableLoading = props => (
    <div className="l-bar-container">
        <div className="l-bars">
            <span className="firstbar bar"></span>
        </div>
        <div className="l-bars">
            <span className="secondbar bar"></span>
        </div>
        <div className="l-bars">
            <span className="thirdbar bar"></span>
        </div>
    </div>
);

export const GraphLoading = props => (
    <div className="gl-container">
        <div className="gl-loader">
            <div class='gl-square'></div>
            <div class='gl-square'></div>
            <div class='gl-square'></div>
            <div class='gl-square'></div>
            <div class='gl-square'></div>
            <div class='gl-square'></div>
            <div class='gl-square'></div>
        </div>
    </div>
);