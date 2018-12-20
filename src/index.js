/** ****************************************************************************
/* Name: Isaac Harries
/* email: isaach@flowjo.com
/* Date: 09/20/17
/* Description: this file is the Main of Mosaic. All style sheets are imported
/* here for convenience.
***************************************************************************** */

// Dependencies
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import "./style.css";

import Mosaic from './components/mosaic';
import {ipcRenderer} from "electron";
import mosaicStore from "./ReduxStore/reactStore";
import {updateTable} from "./ReduxStore/actions";
import { showOnAppReady } from './helper/func';
/* global window document */
showOnAppReady();
/** ****************************************************************************
* Function: render
* Description: This method gets called when the component finishes mounting.
* It will render all the components contained in the JSX return statement.
* The Provider component attaches Redux state to all of it's child components
* which is <App />. Whenever writing JSX, make sure it's all wrapped in one
* component, in this case it's <div></div>.
* Parameters: JSX (special react syntax), element
* Returns: NA
***************************************************************************** */
render(
  <Provider store={mosaicStore}>
    <Mosaic/>
  </Provider>,
  document.getElementById("app"),
);
ipcRenderer.on("stitched", (e,m)=>{
  const data = JSON.parse(m);
  // const rowTags = data.rowTags;
  // const rowTagsSize = rowTags.length;
  // let i = rowTagsSize;
  // while (i !== 0) {
  //   const zeroIndex = rowTagsSize - i;
  //   mosaicStore.dispatch(setRowTag(rowTags[zeroIndex], zeroIndex + 1));
  //   --i;
  // }
  mosaicStore.dispatch(updateTable(data.csv));
})