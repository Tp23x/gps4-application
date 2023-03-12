import { AsyncStorage } from 'react-native';

const INITIAL_STATE = null;

function goalReducer( state = INITIAL_STATE, action) {
    switch( action.type ) {
        case 'addgoal':
            AsyncStorage.setItem('usergoals', JSON.stringify(action.payload));
            return action.payload;
            break;
        default : 
            return state;
            break;
    }
}

export default goalReducer;