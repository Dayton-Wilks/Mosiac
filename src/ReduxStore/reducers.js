import TYPES from './stateTypes';

export const InitialState = {
    file: null,
    loading: false,
    tableData: [],
    tab: 'SHOW_TABLE',
    python: {exist: true, pythonInstalled: false, pythonInstalling: false},
    currentVisualization: 'BoxAndWhisker',
    TagTab: true,
    clusterGrammer: {
        URL: null,
        multView: false,
        heatMap: false
    },
    tableActions: {
        doneActions: [],
        undoneActions: []
    },
    isStitchWindowActive: false
};

// add new
export default (state = InitialState, action) => {
    switch (action.type) {

        case TYPES.SET_FILE: {
            if (state.file == action.payload) return state;
            return { ...state, file: action.payload };
        }

        case TYPES.SET_TABLE: {
            return { ...state, tableData: action.payload };
        }

        case TYPES.TOGGLE_VIEW: {
            if (state.tab == action.tab) return state;
            return { ...state, tab: action.payload };
        }

        case TYPES.PYTHON.SET_EXIST: {
            if (state.python.exist === action.payload) return state;
            return { ...state, python: { ...state.python, exist: action.payload } };
        }

        case TYPES.PYTHON.SET_PYTHON_INSTALLED: {
            if (state.python.installed == action.payload) return state;
            return { ...state, python: { ...state.python, pythonInstalled: action.payload } };
        }

        case TYPES.PYTHON.SET_PYTHON_INSTALLING: {
            if (state.python.installing === action.payload) return state;
            return { ...state, python: { ...state.python, pythonInstalling: action.payload } };
        }

        case TYPES.SET_VISUALIZATION: {
            if (state.currentVisualization === action.payload) return state;
            return { ...state, currentVisualization: action.payload };
        }

        case TYPES.SET_CURRENT_TAG_TAB: {
            if (state.tab === action.payload) return state;
            return { ...state, TagTab: action.payload }
        }

        case TYPES.SET_LOADING: {
            if (state.loading === action.payload) return state;
            return { ...state, loading: action.payload };
        }

        case TYPES.CLUSTERGRAMMER.SET_URL: {
            if (state.clusterGrammer.URL === action.payload) return state;
            return { ...state, clusterGrammer: { ...state.clusterGrammer, URL: action.payload } };
        }

        case TYPES.CLUSTERGRAMMER.SET_MULT_VIEW: {
            if (state.clusterGrammer.multView === action.payload) return state;
            return { ...state, clusterGrammer: { ...state.clusterGrammer, multView: action.payload } };
        }

        case TYPES.CLUSTERGRAMMER.SET_HEAT_MAP: {
            if (state.clusterGrammer.heatMap === action.payload) return state;
            return { ...state, clusterGrammer: { ...state.clusterGrammer, heatMap: action.payload } };
        }

        case TYPES.SET_TABLE_ACTIONS: {
            if (state.tableActions === action.payload) return state;
            return { ...state, tableActions: { doneActions: action.payload.doneActions, undoneActions: action.payload.undoneActions } }
        }

        case TYPES.SET_STITCH_ACTIVE: {
            return Object.assign({}, state, {
                isStitchWindowActive: action.payload
            });
        }

        default: {
            return state;
        }
    }
}