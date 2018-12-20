/**
* Author: Paul Wyatt
* Date Created: August 15, 2018
* Purpose: Spectron test for box and whisker
*/
var Application = require('spectron').Application
var should = require('chai').should();
var navigator = window.navigator;
const expect = require('chai').expect;


var assert = require('assert')

describe('application launch', function () {
  var isMac = process.platform;
  var pathMosaic;
  if(isMac == 'darwin')
    pathMosaic = '/Applications/Mosaic.app/Contents/MacOS/Mosaic';
  else 
    pathMosaic = './release-builds/Mosaic-win32-ia32/Mosaic.exe';
  var app = new Application({
    path: pathMosaic
  })
  var timeout = 30000;

  this.timeout(timeout);

  before(function () {
    return app.start().then(function (){
      try{app.client.windowByIndex(1);}
      catch(error){
        console.error(error);
      }
    })
    .then(function () {
      app.isRunning().should.equal(true);
      var client = app.client;
      client.timeoutsImplicitWait(timeout);
      client.timeoutsAsyncScript(timeout);
      client.timeouts("page load", timeout);
    }, function (err) {
        console.error(err);
    });
  });

  after(function () {
    if (app && app.isRunning()) {
      return app.stop();
    }
  });

  it('isVisible', async ()=> {
    const isVis = await app.browserWindow.isVisible();
    assert.equal(isVis, true);
  });
  it('twoWindow', async () => {
    const count = await app.client.getWindowCount();
    assert.equal(count, 2); //one for splash screen one for main app 
  });
  it('getTitle', async () => {
    const title = await app.client.getTitle();
    assert.equal('Mosaic', title);
  });
  it('mainAppLoads', async () => {
    const appVisible = await app.client.element('#appWindowDiv').isVisible();
    assert.equal(appVisible, true);
  });
  it ('checkDropDownsNotVisible', async () => {
    //TODO: change id name away from myEditDropdown
    const editNotVisible = await app.client.element('#editDropdown').isVisible();
    assert.equal(editNotVisible, false);
  });
  it ('clickOnEditDesplaysDropdown', async () => {
    await app.client.element('#f-edit').click();
    const editVisible = await app.client.element('#editDropdown').isVisible();
    assert.equal(editVisible, true);
  });
  it ('clickOnFileDesplaysDropdown', async () => {
    await app.client.element('#f-edit').click();
    const editNotVisible = await app.client.element('#editDropdown').isVisible();
    assert.equal(editNotVisible, false);
    await app.client.element('#f-file').click();
    const fileVisible = await app.client.element('#fileDropdown').isVisible();
    assert.equal(fileVisible, true);
  });
  it ('graphTabClick', async () =>{
    const graphTabVisible = await app.client.element('#mosaicGraphTab').isVisible();
    assert.equal(graphTabVisible, true);
    await app.client.element('#mosaicGraphTab').click();
    const graphViewLoads = await app.client.element('#graphViewWindowDiv').isVisible();
    assert.equal(graphViewLoads, true);
  });
  it ('clickBoxAndWhisker', async()=> {
    const boxVis = await app.client.element('#BoxAndWhisker').isVisible();
    assert(boxVis,true);
    await app.client.element('#BoxAndWhisker').click();
  });
  it ('boxAndWhiskerLoads', async () => {
    const boxDivLoads = await app.client.element('#boxAndWhiskerDiv').isVisible();
    assert.equal(boxDivLoads, true);
  });
  it ('clickChordDiagram', async()=> {
    const chordVis = await app.client.element('#ChordDiagram').isVisible();
    assert(chordVis,true);
    await app.client.element('#ChordDiagram').click();
  });
  it ('chorDiagramLoads', async()=>{
    const chordLoads = await app.client.element('#component1-group0').isVisible();
    assert.equal(chordLoads,true);
  });
  it ('clickMST', async()=> {
    const boxVis = await app.client.element('#MinSpanningTree').isVisible();
    assert(boxVis,true);
    await app.client.element('#MinSpanningTree').click();
  });
  it ('mstLoads', async () => {
    const boxDivLoads = await app.client.element('#MST').isVisible();
    assert.equal(boxDivLoads, true);
  });
  it ('clickClustergrammer', async () => {
    const clustergrammerVis = await app.client.element('#Clustergrammer').isVisible();
    assert.equal(clustergrammerVis, true);
    await app.client.element('#Clustergrammer').click();
  });
  it ('clustergrammerLoadsClusterGrammer', async()=>{
    const clusterLoads = await app.client.element('#clusterGrammerID').isVisible();
    assert.equal(clusterLoads,true);
  });
  
});