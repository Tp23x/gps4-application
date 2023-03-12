/* eslint-disable react/prop-types */
import React from 'react';
import {
  AsyncStorage,
  View,
  StyleSheet,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

import {ScrollView} from 'react-native-gesture-handler';
import * as firebase from 'firebase';
import 'firebase/auth';
import {firebaseConfig} from '../../../firebaseConfig';

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
import {LoginManager, AccessToken} from 'react-native-fbsdk';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import {
  Container,
  Centered,
  TextInput,
  Button,
  Text,
  colors,
  routes,
  Spacer,
} from '../../shared';

import {connect} from 'react-redux';
import trans from '../../shared/lang';
import {mapStatetoProps, mapDispatchToProps} from '../../store/store';
import {storeToken} from '../../store/util';

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      loginError: '',
      spinner: false,
    };
    this.signInAsync = this.signInAsync.bind(this);
    this.signInWithGoogle = this.signInWithGoogle.bind(this);
    this.signInWithFacebook = this.signInWithFacebook.bind(this);
    this.createSocialUser = this.createSocialUser.bind(this);
  }

  componentDidMount() {
    let _loggedInUid = null;
    AsyncStorage.getItem('uid', (err, uid) => {
      if (err != null) {
        // console.log('sign in -> uid error: ', err);
      } else {
        _loggedInUid = uid;
      }
    });
    console.log( firebaseConfig.webClientId );
    GoogleSignin.configure({
      androidClientId: firebaseConfig.webClientId,
    });

    if (_loggedInUid) {
      this.props.navigation.navigate(routes.goal);
    } else {
      // GoogleSignin.configure({
      //   androidClientId: firebaseConfig.webClientId,
      // });
    }
  }

  async signInAsync(email, password) {
    console.log( 'signing in...');
    this.setState({spinner: true});
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(response => {
        this.props.logUserIn(response.user);
        this.setState({spinner: false});
        this.props.navigation.navigate(routes.goal);
      })
      .catch(err => {
        this.setState({spinner: false});
        this.setState({loginError: err.message});
        //no translation for error.message
      });
  }

  async signInWithGoogle(){
    
  }

  async signInWithFacebook() {
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);
    if (result.isCancelled) {
      // console.log('User cancelled the login process');
      return false;
    }
    const data = await AccessToken.getCurrentAccessToken();

    // if (!data) {
    //   console.log('Something went wrong obtaining access token');
    // }
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );
    auth()
      .signInWithCredential(facebookCredential)
      .then(user => {
        let createdUser = null;
        if( user.additionalUserInfo.isNewUser ){
          createdUser = this.createSocialUser(user, 'facebook');
          if( createdUser ){
            this.props.logUserIn(user.user);
            this.setState({spinner: false});
            this.props.navigation.navigate(routes.goal);
          }
        }else{
          this.props.logUserIn(user.user);
          this.setState({spinner: false});
          this.props.navigation.navigate(routes.goal);
        }
      })
      .catch(error => {
        // console.log('fb login error: ', error);
      });
  }

  async createSocialUser(user, provider) {
    let uuid = '';
    let email = '';
    let username = '';
    let phone = '';
    let fullname = '';
    let picture = '';
    if( provider == 'facebook' ){
      uuid = user.user.uid;
      email = user.user.email;
      let _reg = new RegExp(/(^.+)@/);
      let reg = _reg.exec(user.user.email);
      username = reg[1];
      phone = user.user.phoneNumber;
      fullname = user.user.displayName;
      picture = user.user.photoURL;
    }
    if( provider == 'google' ){
      uuid = '';
      email = '';
      username = '';
      phone = '';
      fullname = '';
      picture = '';
    }

      let that = this;
      await firestore()
      .collection('users')
      .doc(uuid)
      .set({uuid, username, email, fullname, phone, picture})
      .then(response => {
        that.setState({
          spinner: false,
        });
        waitForCreateUserFinish = true;
        
        return true;
      })
      .catch(function(error) {
        that.setState({
          spinner: false,
        });
        return error.message;
        //no translation for error.message
      });
  }

  render() {
    return (
      <KeyboardAvoidingView
        behavior={Platform.os == 'ios' ? 'position' : ''}
        enabled={true}
        style={{flex: 1}}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss}>
          <ScrollView>
            <Spinner
              visible={this.state.spinner}
              textContent={trans('loading', this.props.store.lang)}
              textStyle={styles.spinnerTextStyle}
              color="#fff"
              size="large"
            />
            <ImageBackground
              style={{height: '100%', resizeMode: 'contain'}}
              source={require('../../../assets/images/Signin-BG-06.png')}>
              <Centered style={{backgroundColor: 'transparent'}}>
                <Spacer />
                <Text
                  style={{
                    marginTop: 5,
                    marginBottom: 20,
                  }}
                  header>
                  {trans('login', this.props.store.lang)}
                </Text>
              </Centered>

              <Centered style={{backgroundColor: 'transparent'}}>
                <Spacer />
                <TextInput
                  style={{
                    borderBottomColor: '#cccccc',
                    borderBottomWidth: 1,
                    borderTopWidth: 0,
                    borderLeftWidth: 0,
                    borderRightWidth: 0,
                    borderRadius: 0,
                  }}
                  autoFocus={false}
                  placeholder={trans('email', this.props.store.lang)}
                  keyboardType="email-address"
                  required
                  email
                  autocapitalize="none"
                  initialValue=""
                  onChangeText={value => this.setState({email: value})}
                />
                <TextInput
                  style={{
                    borderBottomColor: '#cccccc',
                    borderBottomWidth: 1,
                    borderTopWidth: 0,
                    borderLeftWidth: 0,
                    borderRightWidth: 0,
                    borderRadius: 0,
                  }}
                  placeholder={trans('password', this.props.store.lang)}
                  password
                  onChangeText={value => this.setState({password: value})}
                />
                <Text style={styles.errorMsg}>{this.state.loginError}</Text>

                <Button
                  style={{
                    backgroundColor: 'none',
                    borderWidth: 1,
                    borderColor: '#cccccc',
                  }}
                  onPress={() =>
                    this.signInAsync(this.state.email, this.state.password)
                  }>
                  <Text style={{color: '#999999'}}>
                    {trans('login', this.props.store.lang)}
                  </Text>
                </Button>
              </Centered>

              <Centered style={{backgroundColor: 'transparent'}}>
                <Text
                  style={styles.forgetpw}
                  color={colors.dark}
                  onPress={() => this.props.navigation.navigate(routes.forget)}>
                  {trans('forget', this.props.store.lang)}
                </Text>
                <Spacer />
              </Centered>

              <Spacer />
            </ImageBackground>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  btnContainer: {
    backgroundColor: 'transparent',
  },
  errorMsg: {
    color: 'red',
    paddingHorizontal: 20,
  },
  forgetpw: {
    textAlign: 'right',
    color: '#999999',
    fontSize: 16,
  },
});

export default connect(
  mapStatetoProps,
  mapDispatchToProps,
)(SignIn);
