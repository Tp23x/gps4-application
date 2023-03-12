/* eslint-disable react/prop-types */
import React from 'react';
import {
  AsyncStorage,
  SafeAreaView,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
  View,
} from 'react-native';

import Video from 'react-native-video';

import {Text} from '../../shared/styledComponents';
import * as firebase from 'firebase';
import 'firebase/auth';

import {connect} from 'react-redux';
import trans from '../../shared/lang';
import {mapStatetoProps, mapDispatchToProps} from '../../store/store';

import firestore from '@react-native-firebase/firestore';
import {routes} from '../../shared/routes';

class VdosList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      player: null,
      paused: false,

      vdo_control: [],
      vdo_focus: [],
      vdo_now: [],
      vdo_selfcom: [],
    };

    this.onLoad = this.onLoad.bind(this);
    this.getVdos = this.getVdos.bind(this);
  }

  componentDidMount() {
    this.getVdos();
  }

  getVdos() {
    firestore()
      .collection('vdos')
      .get()
      .then(vdos => {
        vdos.forEach(vdo => {
          let _vdos = [];
          let d = vdo.data();
          d.id = vdo.id;
          let category = d.category.toLowerCase();
          if (category == 'control') {
            _vdos = this.state.vdo_control;
            _vdos.push(d);
            this.setState({
              vdo_control: _vdos,
            });
          } else if (category == 'focus') {
            _vdos = this.state.vdo_focus;
            _vdos.push(d);
            this.setState({
              vdo_focus: _vdos,
            });
          } else if (category == 'now') {
            _vdos = this.state.vdo_now;
            _vdos.push(d);
            this.setState({
              vdo_now: _vdos,
            });
          } else if (category == 'selfcom') {
            _vdos = this.state.vdo_selfcom;
            _vdos.push(d);
            this.setState({
              vdo_selfcom: _vdos,
            });
          }
        });
      })
      .catch(error => {
        console.log('get vdo error: ', error);
      });
  }

  onLoad() {
    this.setState({paused: true});
  }

  onBuffer() {}

  onError() {}

  render() {
    // const introVdo = "https://firebasestorage.googleapis.com/v0/b/ta168demo.appspot.com/o/gps4-intro.MP4?alt=media&token=c7277620-137b-4b1d-818e-7a3fcfb0eb00";
    const introVdo =
      'https://firebasestorage.googleapis.com/v0/b/ta168-8d469.appspot.com/o/gps4-intro.MP4?alt=media&token=3575a47f-f41a-474c-bb79-b75e4004ec8a';
    return (
      <View style={styles.vdoContainer}>
        <View style={{flex: 1}}>
          <Video
            source={{uri: introVdo}}
            onLoad={this.onLoad}
            controls={true}
            fullscreen={false}
            resizeMode="cover"
            paused={this.state.paused}
            poster={'../../../assets/images/introduction2.png'}
            posterResizeMode="contain"
            style={styles.vdoElement}
          />
          <View style={{margin: 20}}>
            <Text style={{fontSize: 18, marginTop: 1, color: 'black'}}>
              {trans('to_test_intro', this.props.store.lang)}
            </Text>
          </View>
        </View>
        <View
          style={{
            marginHorizontal: 20,
            marginBottom: 20,
          }}>
          <Text style={{fontSize: 24, color: 'black'}}>
            {trans('course_category', this.props.store.lang)}
          </Text>
        </View>
        <ScrollView style={{flex: 1}}>
          {/* Control */}
          {this.state.vdo_control.length > 0 && (
            <View style={{flex: 1}}>
              <View style={{flexDirection: 'row', marginHorizontal: 20}}>
                <View style={{flex: 2}}>
                  <Text style={styles.subtitle}>
                    {trans('test_control', 'en')} : {'\n'}
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: 'normal',
                        color: '#666666',
                      }}>
                      {trans('test_control', 'th')}
                    </Text>
                  </Text>
                </View>
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'normal',
                      color: '#808080',
                      textAlign: 'right',
                    }}
                    onPress={() => {
                      this.props.navigation.navigate(routes.vdoGroup, {
                        category: 'control',
                      });
                    }}>
                    {trans('see_all', this.props.store.lang)}
                  </Text>
                </View>
              </View>
              <ScrollView
                horizontal={true}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  marginVertical: 20,
                  marginLeft: 20,
                }}>
                {this.state.vdo_control.map(vd => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.navigate(routes.vdos, {
                          id: vd.id,
                        });
                      }}>
                      <View style={{flex: 1, marginRight: 20}}>
                        <Image
                          source={{uri: vd.cover_image}}
                          resizeMode="cover"
                          style={styles.vdoPoster}
                        />
                        <View style={{width:250}}>
                          <Text style={styles.nameCourse}>
                            {this.props.store.lang == 'en'
                              ? vd.title
                                ? vd.title
                                : vd.title_th
                              : vd.title_th
                              ? vd.title_th
                              : vd.title}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* Now */}
          {this.state.vdo_now.length > 0 && (
            <View style={{flex: 1}}>
              <View style={{flexDirection: 'row', marginHorizontal: 20}}>
                <View style={{flex: 2}}>
                  <Text style={styles.subtitle}>
                    {trans('test_now', 'en')} : {'\n'}
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: 'normal',
                        color: '#666666',
                      }}>
                      {trans('test_now', 'th')}
                    </Text>
                  </Text>
                </View>
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'normal',
                      color: '#808080',
                      textAlign: 'right',
                    }}>
                    {trans('see_all', this.props.store.lang)}
                  </Text>
                </View>
              </View>
              <ScrollView
                horizontal={true}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  marginVertical: 20,
                  marginLeft: 20,
                }}>
                {this.state.vdo_now.map(vd => {
                  return (
                    <View style={{flex: 1, marginRight: 20}}>
                      <Image
                        source={{uri: vd.cover_image}}
                        resizeMode="cover"
                        style={styles.vdoPoster}
                      />
                      <View style={{width:250}}>
                          <Text style={styles.nameCourse}>
                            {this.props.store.lang == 'en'
                              ? vd.title
                                ? vd.title
                                : vd.title_th
                              : vd.title_th
                              ? vd.title_th
                              : vd.title}
                          </Text>
                        </View>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* Salf Communication */}
          {this.state.vdo_selfcom.length > 0 && (
            <View style={{flex: 1}}>
              <View style={{flexDirection: 'row', marginHorizontal: 20}}>
                <View style={{flex: 2}}>
                  <Text style={styles.subtitle}>
                    {trans('test_self_communication', 'en')} : {'\n'}
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: 'normal',
                        color: '#666666',
                      }}>
                      {trans('test_self_communication', 'th')}
                    </Text>
                  </Text>
                </View>
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'normal',
                      color: '#808080',
                      textAlign: 'right',
                    }}>
                    {trans('see_all', this.props.store.lang)}
                  </Text>
                </View>
              </View>
              <ScrollView
                horizontal={true}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  marginVertical: 20,
                  marginLeft: 20,
                }}>
                {this.state.vdo_selfcom.map(vd => {
                  return (
                    <View style={{flex: 1, marginRight: 20}}>
                      <Image
                        source={{uri: vd.cover_image}}
                        resizeMode="cover"
                        style={styles.vdoPoster}
                      />
                      <View style={{width:250}}>
                          <Text style={styles.nameCourse}>
                            {this.props.store.lang == 'en'
                              ? vd.title
                                ? vd.title
                                : vd.title_th
                              : vd.title_th
                              ? vd.title_th
                              : vd.title}
                          </Text>
                        </View>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* Focus */}
          {this.state.vdo_focus.length > 0 && (
            <View style={{flex: 1}}>
              <View style={{flexDirection: 'row', marginHorizontal: 20}}>
                <View style={{flex: 2}}>
                  <Text style={styles.subtitle}>
                    {trans('test_focus', 'en')} : {'\n'}
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: 'normal',
                        color: '#666666',
                      }}>
                      {trans('test_focus', 'th')}
                    </Text>
                  </Text>
                </View>
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'normal',
                      color: '#808080',
                      textAlign: 'right',
                    }}>
                    {trans('see_all', this.props.store.lang)}
                  </Text>
                </View>
              </View>
              <ScrollView
                horizontal={true}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  marginVertical: 20,
                  marginLeft: 20,
                }}>
                {this.state.vdo_focus.map(vd => {
                  return (
                    <View style={{flex: 1, marginRight: 20}}>
                      <Image
                        source={{uri: vd.cover_image}}
                        resizeMode="cover"
                        style={styles.vdoPoster}
                      />
                      <View style={{width:250}}>
                          <Text style={styles.nameCourse}>
                            {this.props.store.lang == 'en'
                              ? vd.title
                                ? vd.title
                                : vd.title_th
                              : vd.title_th
                              ? vd.title_th
                              : vd.title}
                          </Text>
                        </View>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  vdoContainer: {
    flex: 1,
    //marginTop: 90
    //width: 415
  },

  vdoElement: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: 250,
    // marginTop: 50,
    justifyContent: 'center',
    alignContent: 'center',
    // backgroundColor: 'gray',
  },

  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  nameCourse: {
    marginVertical: 10,
    color: '#666666',
  },
  vdoPoster: {
    height: 140,
    width: 250,
  },
});
// export default VdosList;
export default connect(
  mapStatetoProps,
  mapDispatchToProps,
)(VdosList);
