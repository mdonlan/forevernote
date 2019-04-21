import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Link} from "react-router-dom";

import App from './Components/App';
import store from './Redux/Store';

ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}>
                <App />
        </Provider>
    </BrowserRouter>,
    document.querySelector(".root")
);
