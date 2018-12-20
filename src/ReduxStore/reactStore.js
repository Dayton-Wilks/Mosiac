import {createStore, applyMiddleware, compose } from "redux";
import {combineReducers } from "redux";
import thunk from "redux-thunk";
import reducer from './reducers';


const middleware = applyMiddleware(thunk);
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(reducer, composeEnhancers(middleware));
