import { applyMiddleware, createStore, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import combineReducers from './reducers'
import combineSagas from './rootsaga'

const initialState = {}
const sagaMiddleware = createSagaMiddleware()

export default function configureStore() {
	const middleware = [];
	middleware.push(sagaMiddleware);
	const store = createStore(combineReducers, initialState, applyMiddleware(...middleware));
	sagaMiddleware.run(combineSagas);
	return store;
}
