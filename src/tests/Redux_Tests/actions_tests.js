const expect = require('chai').expect;
import TYPES from '../../ReduxStore/stateTypes';
import * as actions from '../../ReduxStore/actions';

/// Action Tests
describe('Redux Actions', () => {
    it('setFile - set file complete', () => {
        let expectedPayload = 'currentFile.csv'
        expect(actions.setFile(expectedPayload)).to.deep.equal({
            type: TYPES.SET_FILE,
            payload: expectedPayload
        })
    })

    it('setFile - empty argument', () => {
        let expectedPayload = undefined
        expect(actions.setFile()).to.deep.equal({
            type: TYPES.SET_FILE,
            payload: expectedPayload
        })
    })

    it('setTable - 2x2 valid', () => {
        let expectedPayload = [[1,2],[3,4]];
        expect(actions.setTable(expectedPayload)).to.deep.equal({
            type: TYPES.SET_TABLE,
            payload: expectedPayload
        })
    })

    it('setTable - 1x2 valid', () => {
        let expectedPayload = [[1,2]];
        expect(actions.setTable(expectedPayload)).to.deep.equal({
            type: TYPES.SET_TABLE,
            payload: expectedPayload
        })
    })

    it('setTable - empty', () => {
        let expectedPayload = undefined;
        expect(actions.setTable()).to.deep.equal({
            type: TYPES.SET_TABLE,
            payload: expectedPayload
        })
    })

    it('toggleViews - has payload', () => {
        let expectedPayload = 'payload';
        expect(actions.toggleViews(expectedPayload)).to.deep.equal({
            type: TYPES.TOGGLE_VIEW,
            payload: expectedPayload
        })
    })

    it('toggleViews - no payload', () => {
        let expectedPayload = undefined;
        expect(actions.toggleViews()).to.deep.equal({
            type: TYPES.TOGGLE_VIEW,
            payload: expectedPayload
        })
    })

    it('setPython - exist', () => {
        let expectedPayload = true;
        expect(actions.setPython(true)).to.deep.equal({
            type: TYPES.PYTHON.SET_EXIST,
            payload: expectedPayload
        })
    })

    it('setPython - not exist', () => {
        let expectedPayload = false;
        expect(actions.setPython(false)).to.deep.equal({
            type: TYPES.PYTHON.SET_EXIST,
            payload: expectedPayload
        })
    })

    it('setPythonInstalled - true', () => {
        let expectedPayload = true;
        expect(actions.setPythonInstalled(expectedPayload)).to.deep.equal({
            type: TYPES.PYTHON.SET_PYTHON_INSTALLED,
            payload: expectedPayload
        })
    })

    it('setPythonInstalled - false', () => {
        let expectedPayload = false;
        expect(actions.setPythonInstalled(expectedPayload)).to.deep.equal({
            type: TYPES.PYTHON.SET_PYTHON_INSTALLED,
            payload: expectedPayload
        })
    })

    it('setPythonInstalled - undefined', () => {
        let expectedPayload = undefined;
        expect(actions.setPythonInstalled()).to.deep.equal({
            type: TYPES.PYTHON.SET_PYTHON_INSTALLED,
            payload: expectedPayload
        })
    })

    it('setPythonInstalling - true', () => {
        let expectedPayload = true;
        expect(actions.setPythonInstalling(expectedPayload)).to.deep.equal({
            type: TYPES.PYTHON.SET_PYTHON_INSTALLING,
            payload: expectedPayload
        })
    })

    it('setPythonInstalling - false', () => {
        let expectedPayload = false;
        expect(actions.setPythonInstalling(expectedPayload)).to.deep.equal({
            type: TYPES.PYTHON.SET_PYTHON_INSTALLING,
            payload: expectedPayload
        })
    })

    it('setPythonInstalling - undefined', () => {
        let expectedPayload = undefined;
        expect(actions.setPythonInstalling()).to.deep.equal({
            type: TYPES.PYTHON.SET_PYTHON_INSTALLING,
            payload: expectedPayload
        })
    })

    it('setCurrentVis - set to 0', () => {
        let expectedPayload = 0;
        expect(actions.setCurrentVis(expectedPayload)).to.deep.equal({
            type: TYPES.SET_VISUALIZATION,
            payload: expectedPayload
        })
    })

    it('setCurrentVis - set to 1', () => {
        let expectedPayload = 1;
        expect(actions.setCurrentVis(expectedPayload)).to.deep.equal({
            type: TYPES.SET_VISUALIZATION,
            payload: expectedPayload
        })
    })

    it('setCurrentVis - no arg', () => {
        let expectedPayload = undefined;
        expect(actions.setCurrentVis()).to.deep.equal({
            type: TYPES.SET_VISUALIZATION,
            payload: expectedPayload
        })
    })

    it('setCurrentTagTab - 0', () => {
        let expectedPayload = 0;
        expect(actions.setCurrentTagTab(expectedPayload)).to.deep.equal({
            type: TYPES.SET_CURRENT_TAG_TAB,
            payload: expectedPayload
        })
    })

    it('setCurrentTagTab - 1', () => {
        let expectedPayload = 1;
        expect(actions.setCurrentTagTab(expectedPayload)).to.deep.equal({
            type: TYPES.SET_CURRENT_TAG_TAB,
            payload: expectedPayload
        })
    })

    it('setCurrentTagTab - no arg', () => {
        let expectedPayload = undefined;
        expect(actions.setCurrentTagTab()).to.deep.equal({
            type: TYPES.SET_CURRENT_TAG_TAB,
            payload: expectedPayload
        })
    })

    it('setLoading - true', () => {
        let expectedPayload = true;
        expect(actions.setLoading(expectedPayload)).to.deep.equal({
            type: TYPES.SET_LOADING,
            payload: expectedPayload
        })
    })

    it('setLoading - false', () => {
        let expectedPayload = false;
        expect(actions.setLoading(expectedPayload)).to.deep.equal({
            type: TYPES.SET_LOADING,
            payload: expectedPayload
        })
    })

    it('setLoading - no arg', () => {
        let expectedPayload = undefined;
        expect(actions.setLoading()).to.deep.equal({
            type: TYPES.SET_LOADING,
            payload: expectedPayload
        })
    })

    it('setClusterGrammer_URL - new url string', () => {
        let expectedPayload = 'newURL';
        expect(actions.setClusterGrammer_URL(expectedPayload)).to.deep.equal({
            type: TYPES.CLUSTERGRAMMER.SET_URL,
            payload: expectedPayload
        })
    })
    
    it('setClusterGrammer_URL - no arg', () => {
        let expectedPayload = undefined;
        expect(actions.setClusterGrammer_URL()).to.deep.equal({
            type: TYPES.CLUSTERGRAMMER.SET_URL,
            payload: expectedPayload
        })
    })

    it('setClusterGrammer_MultView - string', () => {
        let expectedPayload = 'multView';
        expect(actions.setClusterGrammer_MultView(expectedPayload)).to.deep.equal({
            type: TYPES.CLUSTERGRAMMER.SET_MULT_VIEW,
            payload: expectedPayload
        })
    })

    it('setClusterGrammer_MultView - no arg', () => {
        let expectedPayload = undefined;
        expect(actions.setClusterGrammer_MultView()).to.deep.equal({
            type: TYPES.CLUSTERGRAMMER.SET_MULT_VIEW,
            payload: expectedPayload
        })
    })

    it('setClusterGrammer_HeatMap - string', () => {
        let expectedPayload = 'HeatMap';
        expect(actions.setClusterGrammer_HeatMap(expectedPayload)).to.deep.equal({
            type: TYPES.CLUSTERGRAMMER.SET_HEAT_MAP,
            payload: expectedPayload
        })
    })

    it('setClusterGrammer_HeatMap - no arg', () => {
        let expectedPayload = undefined;
        expect(actions.setClusterGrammer_HeatMap()).to.deep.equal({
            type: TYPES.CLUSTERGRAMMER.SET_HEAT_MAP,
            payload: expectedPayload
        })
    })
})