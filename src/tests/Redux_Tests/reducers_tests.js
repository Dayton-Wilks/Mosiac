const expect = require('chai').expect;
import TYPES from '../../ReduxStore/stateTypes';
import reducer from '../../ReduxStore/reducers';
import { InitialState } from '../../ReduxStore/reducers';

describe('Redux Reducers - default', () => {
    let stateWithModifiedFile =  {...InitialState, file: 'modifiedFile'};

    it('Args: state=undefined, type=invalid, payload=valid', () => {
        let inputState = undefined;
        let inputType = 'wrong type';
        let inputPayload = 'string';
        let expectedResult = InitialState;
        expect(
            reducer(inputState, {
            type: inputType,
            payload: inputPayload
            })
        ).to.equal(expectedResult);
    })

    it('Args: state=undefined, type=invalid, payload=undefined', () => {
        let inputState = undefined;
        let inputType = 'wrong type';
        let inputPayload = undefined;
        let expectedResult = InitialState;
        expect(
            reducer(inputState, {
            type: inputType,
            payload: inputPayload
            })
        ).to.equal(expectedResult);
    })

    it('Args: state=undefined, state=undefined, payload=undefined', () => {
        let inputState = undefined;
        let inputType = undefined;
        let inputPayload = undefined;
        let expectedResult = InitialState;
        expect(
            reducer(inputState, {
            type: inputType,
            payload: inputPayload
            })
        ).to.equal(expectedResult)
    })

    it('Args: state=modified, type=invalid, payload=valid', () => {
        let inputState = stateWithModifiedFile;
        let inputType = 'wrong type';
        let inputPayload = 'string';
        let expectedResult = stateWithModifiedFile;
        expect(
            reducer(inputState, {
            type: inputType,
            payload: inputPayload
            })
        ).to.equal(expectedResult)
    })

    it('Args: state=modified, type=invalid, payload=invalid', () => {
        let inputState = stateWithModifiedFile;
        let inputType = 'wrong type';
        let inputPayload = undefined;
        let expectedResult = stateWithModifiedFile;
        expect(
            reducer(inputState, {
            type: inputType,
            payload: inputPayload
            })
        ).to.equal(expectedResult)
    })

    it('Args: state=modified, type=undefined, payload=undefined', () => {
        let inputState = stateWithModifiedFile;
        let inputType = undefined;
        let inputPayload = undefined;
        let expectedResult = stateWithModifiedFile;
        expect(
            reducer(inputState, {
            type: inputType,
            payload: inputPayload
            })
        ).to.equal(expectedResult)
    })
})

describe('Redux Reducers - file', () => {
    let stateWithModifiedFile = {...InitialState, file: 'modifiedFile'};


    it('Args: state=undefined, input=valid, payload=valid', () => {
        let inputState = undefined
        let inputType = TYPES.SET_FILE;
        let inputPayload = 'newFile';
        let expectedResult = {...InitialState, file: inputPayload};
        expect(
            reducer(inputState, {
            type: inputType,
            payload: inputPayload
            })
        ).to.deep.equal(expectedResult)
    })

    it('Args: state=modified, type=valid, payload=valid', () => {
        let inputState = stateWithModifiedFile
        let inputType = TYPES.SET_FILE;
        let inputPayload = 'newFile';
        let expectedResult = {...stateWithModifiedFile, file: inputPayload};
        expect(
            reducer(inputState, {
            type: inputType,
            payload: inputPayload
            })
        ).to.deep.equal(expectedResult)
    })
})

describe('Redux Reducers - table data', () => {
    let stateWithModifiedTableData = {...InitialState, tableData: [[0,1], [2,3]]}

    it('Args: state=undefined, input=valid, payload=emptyArray', () => {
        let inputState = undefined;
        let inputType = TYPES.SET_TABLE;
        let inputPayload = [];
        let expectedResult = {...InitialState, tableData: inputPayload};
        expect(
            reducer(inputState, {
            type: inputType,
            payload: inputPayload
            })
        ).to.deep.equal(expectedResult)
    })

    it('Args: state=undefined, input=valid, payload=filledArray', () => {
        let inputState = undefined;
        let inputType = TYPES.SET_TABLE;
        let inputPayload = [[5,6],[7,8]];
        let expectedResult = {...InitialState, tableData: inputPayload};
        expect(
            reducer(inputState, {
            type: inputType,
            payload: inputPayload
            })
        ).to.deep.equal(expectedResult)
    })

    it('Args: state=modified, input=valid, payload=emptyArray', () => {
        let inputState = stateWithModifiedTableData;
        let inputType = TYPES.SET_TABLE;
        let inputPayload = [];
        let expectedResult = {...stateWithModifiedTableData, tableData: inputPayload};
        expect(
            reducer(inputState, {
            type: inputType,
            payload: inputPayload
            })
        ).to.deep.equal(expectedResult)
    })

    it('Args: state=modified, input=valid, payload=filledArray', () => {
        let inputState = stateWithModifiedTableData;
        let inputType = TYPES.SET_TABLE;
        let inputPayload = [[5,6],[7,8]];
        let expectedResult = {...stateWithModifiedTableData, tableData: inputPayload};
        expect(
            reducer(inputState, {
            type: inputType,
            payload: inputPayload
            })
        ).to.deep.equal(expectedResult)
    })
})

describe('Redux Reducers - toggleView', () => {
    let stateWithModifiedView = {...InitialState, tab: 'SHOW_GRAPH'};

    it('Args: state=undefined, input=valid, payload=valid', () => {
        let inputState = InitialState;
        let inputType = TYPES.TOGGLE_VIEW;
        let inputPayload = 'SHOW_GRAPH';
        let expectedResult = {...InitialState, tab: inputPayload};
        expect(
            reducer(inputState, {
            type: inputType,
            payload: inputPayload
            })
        ).to.deep.equal(expectedResult)
    })

    it('Args: state=modified, input=valid, payload=valid', () => {
        let inputState = stateWithModifiedView;
        let inputType = TYPES.TOGGLE_VIEW;
        let inputPayload = 'SHOW_GRAPH';
        let expectedResult = {...stateWithModifiedView, tab: inputPayload};
        expect(
            reducer(inputState, {
            type: inputType,
            payload: inputPayload
            })
        ).to.deep.equal(expectedResult)
    })
})

describe('Redux Reducers - Python:exist', () => {
    it('Args: state=undefined, input=valid, payload=false', () => {
        let inputState = undefined;
        let inputType = TYPES.PYTHON.SET_EXIST;
        let inputPayload = false;
        let expectedResult = {...InitialState, python: {...InitialState.python, exist: inputPayload}};
        expect(
            reducer(inputState, {
            type: inputType,
            payload: inputPayload
            })
        ).to.deep.equal(expectedResult)
    })

    it('Args: state=undefined, input=valid, payload=true', () => {
        let inputState = undefined;
        let inputType = TYPES.PYTHON.SET_EXIST;
        let inputPayload = true;
        let expectedResult = {...InitialState, python: {...InitialState.python, exist: inputPayload}};
        expect(
            reducer(inputState, {
            type: inputType,
            payload: inputPayload
            })
        ).to.deep.equal(expectedResult)
    })    
})

describe('Redux Reducers - Python:Installed', () => {
    it('Args: state=undefined, input=valid, payload=false', () => {
        let inputState = undefined;
        let inputType = TYPES.PYTHON.SET_PYTHON_INSTALLED;
        let inputPayload = false;
        let expectedResult = {...InitialState, python: {...InitialState.python, pythonInstalled: inputPayload}};
        expect(
            reducer(inputState, {
            type: inputType,
            payload: inputPayload
            })
        ).to.deep.equal(expectedResult)
    })

    it('Args: state=undefined, input=valid, payload=true', () => {
        let inputState = undefined;
        let inputType = TYPES.PYTHON.SET_PYTHON_INSTALLED;
        let inputPayload = true;
        let expectedResult = {...InitialState, python: {...InitialState.python, pythonInstalled: inputPayload}};
        expect(
            reducer(inputState, {
            type: inputType,
            payload: inputPayload
            })
        ).to.deep.equal(expectedResult)
    })    
})

describe('Redux Reducers - Python:Installing', () => {
    it('Args: state=undefined, input=valid, payload=false', () => {
        let inputState = undefined;
        let inputType = TYPES.PYTHON.SET_PYTHON_INSTALLING;
        let inputPayload = false;
        let expectedResult = {...InitialState, python: {...InitialState.python, pythonInstalling: inputPayload}};
        expect(
            reducer(inputState, {
            type: inputType,
            payload: inputPayload
            })
        ).to.deep.equal(expectedResult)
    })

    it('Args: state=undefined, input=valid, payload=true', () => {
        let inputState = undefined;
        let inputType = TYPES.PYTHON.SET_PYTHON_INSTALLING;
        let inputPayload = true;
        let expectedResult = {...InitialState, python: {...InitialState.python, pythonInstalling: inputPayload}};
        expect(
            reducer(inputState, {
            type: inputType,
            payload: inputPayload
            })
        ).to.deep.equal(expectedResult)
    })    
})

describe('Redux Reducers - tabTag', () => {
    it('Args: state=undefined, input=valid, payload=0', () => {
        let inputState = undefined;
        let inputType = TYPES.SET_CURRENT_TAG_TAB;
        let inputPayload = 0;
        let expectedResult = {...InitialState, TagTab: inputPayload};
        expect(
            reducer(inputState, {
            type: inputType,
            payload: inputPayload
            })
        ).to.deep.equal(expectedResult)
    })

    it('Args: state=undefined, input=valid, payload=1', () => {
        let inputState = undefined;
        let inputType = TYPES.SET_CURRENT_TAG_TAB;
        let inputPayload = 1;
        let expectedResult = {...InitialState, TagTab: inputPayload};
        expect(
            reducer(inputState, {
            type: inputType,
            payload: inputPayload
            })
        ).to.deep.equal(expectedResult)
    })    
})

describe('Redux Reducers - loading', () => {
    it('Args: state=undefined, input=valid, payload=false', () => {
        let inputState = undefined;
        let inputType = TYPES.SET_LOADING;
        let inputPayload = false;
        let expectedResult = {...InitialState, loading: inputPayload};
        expect(
            reducer(inputState, {
            type: inputType,
            payload: inputPayload
            })
        ).to.deep.equal(expectedResult)
    })

    it('Args: state=undefined, input=valid, payload=true', () => {
        let inputState = undefined;
        let inputType = TYPES.SET_LOADING;
        let inputPayload = true;
        let expectedResult = {...InitialState, loading: inputPayload};
        expect(
            reducer(inputState, {
            type: inputType,
            payload: inputPayload
            })
        ).to.deep.equal(expectedResult)
    })    
})

describe('Redux Reducers - clusterGrammer:url', () => {
    it('Args: state=undefined, input=valid, payload=string', () => {
        let inputState = undefined;
        let inputType = TYPES.CLUSTERGRAMMER.SET_URL;
        let inputPayload = 'Payload';
        let expectedResult = {...InitialState, clusterGrammer: {...InitialState.clusterGrammer, URL: inputPayload}};
        expect(
            reducer(inputState, {
            type: inputType,
            payload: inputPayload
            })
        ).to.deep.equal(expectedResult)
    })  
})

describe('Redux Reducers - clusterGrammer:multView', () => {
    it('Args: state=undefined, input=valid, payload=string', () => {
        let inputState = undefined;
        let inputType = TYPES.CLUSTERGRAMMER.SET_MULT_VIEW;
        let inputPayload = 'Payload';
        let expectedResult = {...InitialState, clusterGrammer: {...InitialState.clusterGrammer, multView: inputPayload}};
        expect(
            reducer(inputState, {
            type: inputType,
            payload: inputPayload
            })
        ).to.deep.equal(expectedResult)
    })  
})

describe('Redux Reducers - clusterGrammer:heatMap', () => {
    it('Args: state=undefined, input=valid, payload=string', () => {
        let inputState = undefined;
        let inputType = TYPES.CLUSTERGRAMMER.SET_HEAT_MAP;
        let inputPayload = 'Payload';
        let expectedResult = {...InitialState, clusterGrammer: {...InitialState.clusterGrammer, heatMap: inputPayload}};
        expect(
            reducer(inputState, {
            type: inputType,
            payload: inputPayload
            })
        ).to.deep.equal(expectedResult)
    })  
})
