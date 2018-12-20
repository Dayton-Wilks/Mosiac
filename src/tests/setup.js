/***********************************************************************
 * Author: Morgan Loring
 * Email: morganl@flowjo.com
 * Purpose: Sets up globals used by enzyme to preform tests on react 
 *    components. JSDOM is a 'fake' window that the components are 
 *    'rendered' in
 ***********************************************************************/

const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { document } = (new JSDOM("<!doctype html><html><body></body></html>")).window;

global.document = document;
global.window = document.defaultView;

global.navigator = {
  userAgent: "node.js"
};