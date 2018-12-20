/**
* Author: Paul Wyatt
* Date Created: August 14, 2018
* Purpose: Spectron test for basic functionality
*/
var Application = require('spectron').Application
var should = require('chai').should();
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
  var graphTab;

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
  it ('switchesBackToTable', async () =>{
    const tableTabVisible = await app.client.element('#mosaicTableTab').isVisible();
    assert.equal(tableTabVisible, true);
    await app.client.element('#mosaicTableTab').click();
    const tableViewLoads = await app.client.element('#tableBox').isVisible();
    assert.equal(tableViewLoads, true);
  });
  
  /*it ('clickOnHelpDesplaysDropdown', async () => {
    await app.client.element('#helpMenu').click();
    const helpVisible = await app.client.element('#myHelpDropdown').isVisible();
    assert.equal(helpVisible, true);
    const fileNotVisible = await app.client.element('#myFileDropdown').isVisible();
    assert.equal(fileNotVisible, false);
  });
  it ('clickOnFeedbackDesplaysDropdown', async () => {
    await app.client.element('#feedbackMenu').click();
    const feedbackVisible = await app.client.element('#myFeedbackDropdown').isVisible();
    assert.equal(feedbackVisible, true);
    const helpNotVisible = await app.client.element('#myHelpDropdown').isVisible();
    assert.equal(helpNotVisible, false);
  });*/
});