/* 
* Author: Jiawei Xu (Kevin)
* File: index.js
* Description:
*	-> navigators for react-router, this will be use when implementing react-router in the future.
*   -> waiting after new styling.
**/
import React from "react";
import {NavLink} from "react-router-dom";

const TabSelectBar = props => (
    <nav>
        <NavLink to="/table">Table</NavLink>
        <NavLink to="/visualizations">Visualizations</NavLink>
    </nav>
)
export default TabSelectBar;