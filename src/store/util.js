import { AsyncStorage } from 'react-native';

export const storeToken = async function(payload){
    try{
      return await AsyncStorage.setItem('user', JSON.stringify(payload) );
    }catch (error ){
      console.log( 'storeToken() error: ', error);
      return null;
    }
  }


export const getToken = async function(){
    try{
        var userData = null;
        await AsyncStorage.getItem('user')
          .then((data) => {
            userData = data;
          });
        let data = JSON.parse(userData);
        console.log( 'getToken() data: ', data);

        return data;
    }catch(error){
        console.log( 'getToken() error: ', error );
        return null;
    }
}