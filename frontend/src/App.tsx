import React from 'react';
import './main.global.css';
import {composeWithDevTools} from "redux-devtools-extension";
import {applyMiddleware, createStore} from "redux";
import HomePage from './pages/HomePage/HomePage';
import {rootReducer} from './store/reducer';
import {Provider} from "react-redux";
import thunk from "redux-thunk";

const middleware = [thunk];
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middleware)));

export default function App() {
  return (
    <Provider store={store}>
      <HomePage />
    </Provider>
  );
}
