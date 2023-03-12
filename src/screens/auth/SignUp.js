/* eslint-disable react/prop-types */
import React, {useState, useEffect, useCallback} from 'react';
import {
  AsyncStorage,
  View,
  StyleSheet,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Alert,
  Platform,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';

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

import * as firebase from 'firebase';
import 'firebase/auth';
import filebaseConfig from '../../../firebaseConfig';
import firestore from '@react-native-firebase/firestore';

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      passwordConf: '',
      fullname: '',
      phone: '',
      loginError: '',

      spinner: false,
    };

    this.clearUserData = this.clearUserData.bind(this);
    this.signUpHandler = this.signUpHandler.bind(this);
    this.createUser = this.createUser.bind(this);
    this.autoLogin = this.autoLogin.bind(this);
    this.goToSignInScreen = this.goToSignInScreen.bind(this);
  }

  componentDidMount() {
    
  }

  clearUserData() {
    this.setState({
      username: '',
      email: '',
      password: '',
      passwordConf: '',
      fullname: '',
      phone: '',
      loginError: '',
    });
  }

  validateEmail(email) {
    var format = /^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*@[a-z0-9]+(\-[a-z0-9]+)*(\.[a-z0-9]+(\-[a-z0-9]+)*)*\.[a-z]{2,4}$/;
    return email.match(format);
  }

  async signUpHandler() {
    this.setState({
      spinner: true,
    });
    
    let email = this.state.email.trim();
    let password = this.state.password;
    let passwordConf = this.state.passwordConf;
    if (
      this.validateEmail(email) === null
    ){
      this.setState({
        spinner: false,
        errorMsg: trans('invalid_email', this.props.store.lang),
      });
    }else if(
      password == '' ||
      password.length < 6 ||
      password != passwordConf
    ) {
      this.setState({
        spinner: false,
        errorMsg: trans('invalid_password', this.props.store.lang),
      });
    } else {
      let waitForCreateUserFinish = null;

      await firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(user => {
          let uuid = user.user.uid;
          waitForCreateUserFinish = uuid;
          // this.createUser(uuid);
          // AsyncStorage.setItem('userToken', user.user);
          /************************************* */
          let email = this.state.email.trim();
          let password = this.state.password;
          let passwordConf = this.state.passwordConf;
          let username = this.state.username;
          let phone = this.state.phone;
          let fullname = this.state.fullname;
          (async function(that) {
            await firestore()
              .collection('users')
              .doc(uuid)
              .set({uuid, username, email, fullname, phone})
              .then(response => {
                that.setState({
                  spinner: false,
                });
                waitForCreateUserFinish = true;
                // that.clearUserData();
                that.setState({
                  loginError: trans('your_registration_is_done', this.props.store.lang),
                });
                // that.props.navigation.navigate(routes.goal);
                // that.autoLogin(email, password);
                console.log( 'go login 1');
                that.goToSignInScreen();
              })
              .catch(function(error) {
                that.setState({
                  spinner: false,
                });
              });
          })(this);

          /****************************************** */
          this.clearUserData();
          // this.props.navigation.navigate(routes.goal);
        })
        .catch(err => {
          this.setState({errorMsg: err.message, spinner: false});
          //language translation is not implement for err.message
        });

      if (waitForCreateUserFinish) {
        this.clearUserData();
        this.setState({
          loginError: trans('your_registration_is_done', this.props.store.lang),
        });
        console.log( 'go login2 ');
        this.goToSignInScreen();
        // setTimeout(() => {
        //   this.props.navigation.navigate(routes.goal);
        // }, 1200);
      }
    }
    
  }

  goToSignInScreen(){
    this.props.navigation.navigate(routes.signin);
  }

  async autoLogin(email, password) {
    this.setState({ spinner: true });
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(response => {
        this.props.logUserIn(response.user);
        this.setState({ spinner: false });
        this.props.navigation.navigate(routes.goal);
      })
      .catch(err => {
        this.setState({ spinner: false });
        this.setState({ loginError: err.message });
        //language translation is not implement for err.message
      });
  }

  async createUser(uuid) {
    console.log('creating new user....');
    let email = this.state.email.trim();
    let password = this.state.password;
    let passwordConf = this.state.passwordConf;
    let username = this.state.username;
    let phone = this.state.phone;
    let fullname = this.state.fullname;
    let that = this;
    await firestore()
      .collection('users')
      .doc(uuid)
      .set({uuid, username, email, fullname, phone})
      .then(response => {
        that.setState({
          spinner: false,
        });
        that.clearUserData();
        that.setState({
          loginError: trans('your_registration_is_done', this.props.store.lang),
        });
        console.log('create user to signin' );
        that.props.navigation.navigate(routes.signin);
      })
      .catch(function(error) {
        that.setState({
          spinner: false,
        });
        // console.log('create user error: ', error);
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
              <Centered>
                <Spacer />
                <Text
                  style={{
                    marginTop: 30,
                    marginBottom: 20,
                  }}
                  header>
                  {trans('register', this.props.store.lang)}
                </Text>
              </Centered>

              <Centered>
                {/* Username */}
                <TextInput
                  style={styles.registerInput}
                  autoFocus={false}
                  placeholder={trans('username', this.props.store.lang)}
                  required
                  autocapitalize="none"
                  initialValue=""
                  onChangeText={value => this.setState({username: value})}
                />
                {/* Password */}
                <TextInput
                  style={styles.registerInput}
                  placeholder={trans('password', this.props.store.lang)}
                  required
                  password
                  onChangeText={value => this.setState({password: value})}
                />
                {/* Confirm Password */}
                <TextInput
                  style={styles.registerInput}
                  placeholder={trans('passwordConf', this.props.store.lang)}
                  required
                  password
                  onChangeText={value => this.setState({passwordConf: value})}
                />
                {/* Full name */}
                <TextInput
                  style={styles.registerInput}
                  placeholder={trans('fullName', this.props.store.lang)}
                  onChangeText={value => this.setState({fullname: value})}
                />
                {/* email */}
                <TextInput
                  style={styles.registerInput}
                  autoFocus={false}
                  placeholder={trans('email', this.props.store.lang)}
                  keyboardType="email-address"
                  required
                  email
                  autocapitalize="none"
                  initialValue=""
                  onChangeText={value => this.setState({email: value})}
                />
                {/* Phone */}
                <TextInput
                  style={styles.registerInput}
                  placeholder={trans('phone', this.props.store.lang)}
                  onChangeText={value => this.setState({phone: value})}
                />

                <Text style={styles.errorMsg}>{this.state.errorMsg}</Text>

                <Button
                  style={{
                    backgroundColor: '#0083c1',
                    borderWidth: 0,
                    borderColor: 'none',
                    marginTop: 35,
                  }}
                  onPress={() => this.signUpHandler()}>
                  <Text color={colors.bright}>
                    {trans('signup', this.props.store.lang)}
                  </Text>
                </Button>
              </Centered>

              <Centered>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'normal',
                    paddingHorizontal: 10,
                    textAlign: 'center',
                    padding: 10,
                    color: '#999999',
                  }}>
                  {trans('by_creating_account_you_agree_to', this.props.store.lang)} {'\n'}{' '}
                  <Text style={{color: '#ff671d', fontWeight: 'normal'}}>
                    {trans('term_of_use', this.props.store.lang)}
                  </Text>{' '}
                  {trans('and', this.props.store.lang)}
                  <Text style={{color: '#ff671d', fontWeight: 'normal'}}>
                    {' '}
                    {trans('privacy_policy', this.props.store.lang)}
                  </Text>
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'normal',
                    paddingHorizontal: 20,
                    textAlign: 'center',
                    padding: 10,
                    color: '#999999',
                  }}>
                  {trans('signup_bottom_text', this.props.store.lang)}
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
  errorMsg: {
    color: 'red',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  forgetpw: {
    textAlign: 'right',
    color: '#989898',
  },
  registerInput: {
    paddingTop: 0,
    borderBottomColor: '#cccccc',
    borderBottomWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderRadius: 0,
  },
  spinnerTextStyle: {},
});

export default connect(
  mapStatetoProps,
  mapDispatchToProps,
)(SignUp);
