import { AsyncStorage } from 'react-native';
import { getToken } from './util';

const INITIAL_STATE = null;

async function userReducer( state = INITIAL_STATE, action) {
    switch( action.type ) {
        case 'login':
            const uid = action.payload.uid;
            AsyncStorage.setItem('uid', uid );
            AsyncStorage.setItem('users', JSON.stringify(action.payload) );
            return action.payload;
            break;
        case 'logout':
            AsyncStorage.setItem('uid', null );
            AsyncStorage.setItem('users', null);
            return null;
            break;
        default : 
            await AsyncStorage.getItem('users', (err, user) => {
                if( !err ){
                    return user;
                }else{
                    return state;
                }
            })
            break;
    }
}

export default userReducer;