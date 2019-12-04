import { all } from 'redux-saga/effects';
import ModelSagas from './model/sagas';


export default function* rootSaga(getState) {
   yield all([
        ModelSagas(),
      
   ]);
}
