/* eslint-disable react/prop-types */
import React from "react";
import {
  AsyncStorage,
  View,
  Image,
  StyleSheet,
  ImageBackground,
  Dimensions
} from "react-native";

import "../../../firebaseConfig";

// import { routes } from '../../shared/routes';

import {
  Container,
  Centered,
  Text,
  Button,
  colors,
  routes
} from "../../shared";

import * as firebase from "firebase";
import "firebase/auth";
import { NavigationEvents, NavigationActions } from "react-navigation";
import { Spacer } from "../../shared/styledComponents";

import { connect } from "react-redux";
import trans from "../../shared/lang";
import { mapStatetoProps, mapDispatchToProps } from "../../store/store";

class Intro2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      user: null
    };

    this.checkScreenToGo = this.checkScreenToGo.bind(this);
    this.checkUser = this.checkUser.bind(this);
  }

  componentDidMount() {
    this.checkScreenToGo();

  }

  async checkScreenToGo(){

    let _loggedInUid = null;
    AsyncStorage.getItem("uid", (err, uid) => {
      if( err != null ){
        // console.log( 'intro 2 -> uid error: ', err);
      }else{
        _loggedInUid = uid;
      }
      
    });

    let usergoals = null;
    await AsyncStorage.getItem("usergoals", (err, ugoals) => {
      // handler
      if( err != null ){
        // console.log( 'select lang -> ugoals error: ', err);
      }else{
        usergoals = ugoals;
      }
    });

    if( _loggedInUid && usergoals ){
      this.props.navigation.navigate(routes.home);
    }else if( _loggedInUid ){
      this.props.navigation.navigate(routes.goal);
    }else{
      //stay here
    }
  }

  getUser() {
    AsyncStorage.getItem("uid", (err, user) => {
      // isUserLoggedIn = user;
      if (err == null && user != null) {
        // this.props.navigation.navigate(routes.goal);
        return user;
      } else {
        return false;
      }
    });
  }

  async checkUser() {
    let user = await this.getUser();
    this.setState({ user });
    return user;
  }

  render() {
    const { navigate } = this.props.navigation;
    if (!this.state.isLoading) {
      return (
        <View>
          <Text>{trans('loading', this.props.store.lang)}</Text>
        </View>
      );
    } else {
      return (
        <Container style={{ backgroundColor: "white" }}>
          <View
            style={{
              flex: 1,
              border: 1
            }}
          >
            <ImageBackground
              source={require("../../../assets/images/bg-intro2.png")}
              style={{
                flex: 1,
                flexDirection: "row",
                resizeMode: "contain",
                minWidth: 415,
                maxHeight: Dimensions.get("window").height,
                marginTop: -50
              }}
            >
              <Centered style={styles.logoContainer}>
                <Image
                  source={require("../../../assets/logo.png")}
                  style={styles.imageLogo}
                />
              </Centered>
            </ImageBackground>
          </View>

          <Centered style={{marginBottom: 20}}>
            <Text style={styles.introHeader}>
              {trans("signInOrRegister", this.props.store.lang)}
            </Text>
            <Text
              style={{
                fontWeight: "normal",
                fontSize: 30,
                textAlign: "left",
                color: "#999999"
              }}
            >
              {trans("signInOrRegister2", this.props.store.lang)}
            </Text>
          </Centered>

          <Centered>
            <View style={styles.btnContainer}>
              <Button
                style={{
                  backgroundColor: "#0083c1"
                }}
                onPress={() => navigate(routes.login)}
              >
                <Text color={colors.bright}>
                  {trans("login", this.props.store.lang)}
                </Text>
              </Button>
              <Button
                style={{
                  backgroundColor: "white",
                  borderColor: "#999999",
                  borderWidth: 1
                }}
                onPress={() => navigate(routes.register)}
              >
                <Text
                  style={{
                    fontWeight: "normal",
                    fontSize: 16,
                    color: "#999999"
                  }}
                  // color={colors.dark}
                >
                  {trans("register", this.props.store.lang)}
                </Text>
              </Button>
            </View>
          </Centered>

          <Spacer />
        </Container>
      );
    }
  }
}

const styles = StyleSheet.create({
  btnContainer: {},
  introHeader: {
    fontSize: 30,
    fontWeight: "bold",
    padding: 0,
    textAlign: "left",
    color: "#0083c1"
  },
  logoContainer: {
    //marginTop: 20,
    //paddingVertical: 50,
    flex: 1,
    //flexDirection: "row",
    flexWrap: "wrap",
    alignContent: "center",
    justifyContent: "center",
    width: 150,
    resizeMode: "contain",
    alignItems: "center"
  },
  imageLogo: {
    flex: 1,
    marginTop: 150,
    maxWidth: 200,
    resizeMode: "contain",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default connect(mapStatetoProps, mapDispatchToProps)(Intro2);
