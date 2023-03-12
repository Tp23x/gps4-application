import { AsyncStorage } from 'react-native';

const INITIAL_STATE = 'en';

function langReducer( state = INITIAL_STATE, action) {
    switch( action.type ) {
        case 'en':
        case 'EN':
            AsyncStorage.setItem('lang', 'en');
            return 'en';
            break;
        case 'th': 
        case 'TH': 
            AsyncStorage.setItem('lang', 'th');
            return 'th';
            break;
        default : 
            return state;
            break;
    }
}

export default langReducer;