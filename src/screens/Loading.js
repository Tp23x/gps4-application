/* eslint-disable react/prop-types */
import React from "react";
import { AsyncStorage, View, Text } from 'react-native';

import * as firebase from "firebase";
import "firebase/firestore";

class Loading extends React.Component {
  componentDidMount() {
    console.log("loading screen is loading.....");
    this.state = {
      uid: null,
      user: null, 
      userLang: null, 
      userGoals: null,
      loaded: false
    }
    this.loadConfiguration = this.loadConfiguration.bind(this);
  }
  async loadConfiguration(){
    let userLang = false;
    let uid = false;
    let user = false;
    let userGoals = false;

    userLang = await AsyncStorage.getItem('lang', (err, lang) => {
      if( !err && lang != null && lang != undefined ){
        return lang;
      }else{
        return false;
      }
    });

    uid = await AsyncStorage.getItem('uid', (err, uid) => {
      if( !err && uid != null && uid != undefined ){
        return uid;
      }else{
        return false;
      }
    });

    user = await AsyncStorage.getItem('users', (err, users) => {
      if( !err && users != null && users != undefined ){
        return users;
      }else{
        return false;
      }
    });

    userGoals = await AsyncStorage.getItem('usergoals', (err, ugoals) => {
      if( !err && ugoals != null && ugoals != undefined ){
        return ugoals;
      }else if( !err && ugoals == null ){
        return true;
      }else{
        return false;
      }
    });

    if( 
      ( userLang || userLang !== false )
      && ( uid || uid != false )
      && ( user || user != false )
      && ( userGoals || userGoals != false )
      ){

      this.setState({
        userLang: userLang,
        uid: uid,
        user: user,
        userGoals: userGoals
      })

      return Promise.all([userLang, uid, user, userGoals]);
      // return true;
    }
  }

  onFinish(){
    
  }

  onError(){
    console.log( 'it is error ' );
  }

  render() {
    return (
      <View>
        <Text>Loading....</Text>
      </View>
    );
  }
}

export default Loading;
