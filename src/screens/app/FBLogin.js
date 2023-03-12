import React from 'react';
import { View, Text, Button } from 'react-native';
import firebase from 'firebase';

class FBLogin extends React.Component{
  constructor(props){
    super(props);
  }
  

  handlerFBLogin(){
    firebase.auth().signInWithRedirect(provider);
  }
}