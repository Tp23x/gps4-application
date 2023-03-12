/* eslint-disable react/prop-types */
import React from "react";
import { StyleSheet, ImageBackground } from "react-native";
import * as firebase from "firebase";
import "firebase/auth";

import {
  Container,
  Centered,
  TextInput,
  Button,
  Text
} from "../../shared";

import { connect } from "react-redux";
import trans from "../../shared/lang";
import { mapStatetoProps, mapDispatchToProps } from "../../store/store";

class ForgetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      errorMsg: "",
      successMsg: ""
    };
    this.sendRecoveryLink = this.sendRecoveryLink.bind(this);
  }

  sendRecoveryLink() {
    firebase
      .auth()
      .sendPasswordResetEmail(this.state.email)
      .then(user => {
        this.setState({
          email: "",
          errorMsg: "",
          successMsg: trans('recovery_email_has_been_sent', this.props.store.lang)
        });
      })
      .catch(error => {
        this.setState({ errorMsg: error.message });
        //no translation for err.message
      });
  }

  render() {
    return (
      <Container style={{ backgroundColor: "transparent" }}>
        <ImageBackground
          style={{ height: "100%", resizeMode: "contain" }}
          source={require("../../../assets/images/Signin-BG-06.png")}
          style={{ flex: 1, resizeMode: "cover" }}
        >
          <Centered style={{ backgroundColor: "trapnsparent" }}>
            <Text header>{trans("forget", this.props.store.lang)}</Text>
            <TextInput
              placeholder={trans("email", this.props.store.lang)}
              onChangeText={value => {
                this.setState({ email: value });
              }}
            />
            <Text style={styles.errorMsg}>{this.state.errorMsg}</Text>
            <Text style={styles.successMsg}>{this.state.successMsg}</Text>
          </Centered>

          <Centered style={{ backgroundColor: "transparent" }}>
            <Button
              style={{
                backgroundColor: "none",
                borderWidth: 1,
                borderColor: "#cccccc"
              }}
              onPress={() =>
                this.sendRecoveryLink()
              }
            >
              <Text style={{ color: "#999999" }}>
                {trans("sendRecoveryLink", this.props.store.lang)}
              </Text>
            </Button>
          </Centered>
        </ImageBackground>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  errorMsg: {
    color: "red",
    paddingHorizontal: 20
  },
  successMsg: {
    color: "green",
    paddingHorizontal: 20
  }
});

export default connect(mapStatetoProps, mapDispatchToProps)(ForgetPassword);
