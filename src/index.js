import './index.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

import App from '../src/app/index';
import configureStore from '../src/app/store/store';
const store = configureStore();

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));

// registerServiceWorker();
