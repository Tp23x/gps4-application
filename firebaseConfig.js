import * as firebase from 'firebase';
import 'firebase/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyBlO7Jlw37hbQEvTTTNrZWUc7yEhVZuPUY",
  authDomain: "ta168-8d469.firebaseapp.com",
  databaseURL: "https://ta168-8d469.firebaseio.com",
  projectId: "ta168-8d469",
  storageBucket: "ta168-8d469.appspot.com",
  messagingSenderId: "283467501401",
  appId: "1:283467501401:web:cbe63bbcfeb294a8d64648",

  androidClientId: '283467501401-i1vo3m8ednh0p2ekp6tif05ocsqd16op.apps.googleusercontent.com',
  webClientId: '283467501401-5v7qitos5rc0hs4jav42lnkg73pp3j7g.apps.googleusercontent.com',
  iosClientId: '',

  webClientSecret: 'EEXhjjQ-VoLH_2VJA9Y2HAzm'
};

if( ! firebase.apps.length ) {
  firebase.initializeApp( firebaseConfig );
}
