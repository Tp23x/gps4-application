import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  ImageBackground,
  Image,
  AsyncStorage,
} from 'react-native';

import {Centered, Text, Button} from '../../shared/styledComponents';
import {routes} from '../../shared/routes';

import {connect} from 'react-redux';
import trans from '../../shared/lang';
import {mapStatetoProps, mapDispatchToProps} from '../../store/store';

class Result extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: 0,
      resultMsg: '',
      resultEmoticon: require('../../../assets/images/emo-sad.png'),
      resultColor: 'red'
    };
  }

  componentDidMount() {
    let _result = this.props.navigation.state.params.result;
    _result = _result;
    this.setState({
      result: _result,
    });

    if (_result >= 89) {
      //A
      this.setState({
        resultMsg: trans('result_excellent', this.props.store.lang),
        resultEmoticon: require('../../../assets/images/excellent.png'),
        resultColor: '#0083c1'
      });
    } else if (_result >= 70) {
      //B
      this.setState({
        resultMsg: trans('result_good', this.props.store.lang),
        resultEmoticon: require('../../../assets/images/good.png'),
        resultColor: '#009245'
      });
    } else if (_result >= 50) {
      //C
      this.setState({
        resultMsg: trans('result_average', this.props.store.lang),
        resultEmoticon: require('../../../assets/images/average.png'),
        resultColor: '#fbae17'
      });
    } else if (_result >= 30) {
      //D
      this.setState({
        resultMsg: trans('result_fair', this.props.store.lang),
        resultEmoticon: require('../../../assets/images/fair.png'),
        resultColor: '#c1272d'
      });
    } else {
      //E
      this.setState({
        resultMsg: trans('result_poor', this.props.store.lang),
        resultEmoticon: require('../../../assets/images/poor.png'),
        resultColor: '#c1272d'
      });
    }
  }

  render() {

    return (

      <ScrollView
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}>
        <ImageBackground
          source={require('../../../assets/images/bg-dashboard.jpg')}
          style={{
            resizeMode: 'contain',
          }}>
          <Centered
            style={{
              backgroundColor: 'rgba(255,255,255,0.9)',
              //paddingVertical: 20,
              borderBottomRadius: 50,
              
            }}>
            <Centered
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}>
              <Image
                source={this.state.resultEmoticon}
                style={{
                  resizeMode: 'contain',
                  maxHeight: 150,
                  marginTop: 80,
                }}
              />
            </Centered>

            <Centered>
              <View>
                <Text
                  style={{
                    marginTop: 15,
                  }}>
                  {trans('score', this.props.store.lang)}:
                </Text>
                <Text style={{...styles.scoreNumber, color: this.state.resultColor}}>
                  {this.state.result.toFixed(2)}
                </Text>
              </View>
            </Centered>

            <Centered>
              <Centered>
                <Text>{trans('your_score_level', this.props.store.lang)}</Text>
                <Text
                  style={{
                    fontSize: 60,
                    fontWeight:'bold',
                    //marginTop: 10,
                    textAlign: 'center',
                    color: this.state.resultColor
                  }}>
                  {this.state.resultMsg}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    paddingHorizontal: 30,
                    marginTop: 10,
                    marginBottom: 30,
                    textAlign: 'center',
                    fontWeight: 'normal',
                    color: '#999999',
                  }}>
                  {trans('result_advice', this.props.store.lang)}
                </Text>
              </Centered>
            </Centered>
          </Centered>

          <Centered style={{}}>
            <Button
              style={{
                backgroundColor: '#0083C1',
                marginTop: 50,
              }}
              onPress={() => {
                this.props.navigation.navigate(routes.couses);
              }}>
              <Text
                style={{
                  color: 'white',
                }}>
                {trans('see_vdo', this.props.store.lang)}
              </Text>
            </Button>
            <Text
              style={{
                color: 'white',
                fontSize: 16,
                fontWeight: 'normal',
                marginTop: 10,
                marginBottom: 50,
              }}
              onPress={() => {
                this.props.navigation.navigate(routes.home);
              }}>
              {trans('to_home', this.props.store.lang)}
            </Text>
          </Centered>
        </ImageBackground>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreNumber: {
    fontSize: 70,
    fontWeight: 'bold',
    color: '#0083C1',
  },
});

export default connect(
  mapStatetoProps,
  mapDispatchToProps,
)(Result);

