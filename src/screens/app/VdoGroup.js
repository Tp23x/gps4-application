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

import {
  Container,
  Button,
  Text,
  TextInput,
  Centered,
} from '../../shared/styledComponents';
import {colors} from '../../shared/colors';
import * as firebase from 'firebase';
import 'firebase/auth';

import {connect} from 'react-redux';
import trans from '../../shared/lang';
import {mapStatetoProps, mapDispatchToProps} from '../../store/store';

import firestore from '@react-native-firebase/firestore';
import {routes} from '../../shared/routes';

class VdoGroup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      player: null,
      paused: false,

      selectedCategory: '',
      videos: [],
    };

    this.onLoad = this.onLoad.bind(this);
    this.getData = this.getData.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    let params = this.props.navigation.state.params;
    this.setState({
      selectedCategory: params.category,
    });
    let _vdos = this.state.videos;
    let _category = this.state.selectedCategory;
    firestore()
      .collection('vdos')
      .where('category', '==', params.category)
      .get()
      .then(vdos => {
        vdos.forEach(vdo => {
          let v = vdo.data();
          v.id = vdo.id;
          _vdos.push(v);
          this.setState({
            videos: _vdos,
          });
        });
      })
      .catch(error => {
        console.log('get all vdo error: ', error);
      });
  }

  onLoad() {
    console.log('on load ...');
  }

  onBuffer() {}

  onError() {}

  render() {
    return (
      <ScrollView style={{flex: 1, margin: 20}}>
        <View style={{marginTop: Platform.OS == 'android' ? 80: 40}}>
          {this.state.selectedCategory == 'control' && (
            <Text style={{fontSize: 22, fontWeight: 'bold', color: 'black'}}>
              {trans('gcate_control', 'en')} : {trans('gcate_control', 'th')}
            </Text>
          )}
          {this.state.selectedCategory == 'selfcom' && (
            <Text style={{fontSize: 22, fontWeight: 'bold', color: 'black'}}>
              {trans('gcate_self_communication', 'en')} :{' '}
              {trans('gcate_self_communication', 'th')}
            </Text>
          )}
          {this.state.selectedCategory == 'now' && (
            <Text style={{fontSize: 22, fontWeight: 'bold', color: 'black'}}>
              {trans('gcate_time', 'en')} : {trans('gcate_time', 'th')}
            </Text>
          )}
          {this.state.selectedCategory == 'focus' && (
            <Text style={{fontSize: 22, fontWeight: 'bold', color: 'black'}}>
              {trans('gcate_focus', 'en')} : {trans('gcate_focus', 'th')}
            </Text>
          )}
        </View>

        {this.state.videos.length > 0 &&
          this.state.videos.map(vd => {
            return (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate(routes.vdos, {
                    id: vd.id,
                  });
                }}>
                <View style={styles.vdoRow}>
                  <View style={{width: 180, height: 100}}>
                    <Image
                      source={{uri: vd.cover_image}}
                      resizeMode="cover"
                      style={{width: 180, height: 100, borderRadius: 5}}
                    />
                  </View>
                  <View
                    style={{
                      width: 180,
                      height: 100,
                      marginLeft: 10,
                    }}>
                    <Text style={styles.titleCourse}>
                      {this.props.store.lang == 'en'
                        ? vd.title
                          ? vd.title
                          : vd.title_th
                        : vd.title_th
                        ? vd.title_th
                        : vd.title}
                    </Text>
                    <Text style={styles.description}>
                      {this.props.store.lang == 'en'
                        ? vd.short_description
                          ? vd.short_description
                          : vd.short_description_th
                        : vd.short_description_th
                        ? vd.short_description_th
                        : vd.short_description}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        <Button style={{backgroundColor: '#0083c1'}} onPress={() => this.props.navigation.navigate(routes.couses)}>
          <Text color={colors.bright}>
            {trans('back', this.props.store.lang)}
          </Text>
        </Button>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  vdoRow: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 30,
  },

  titleCourse: {
    color: 'black',
    marginTop: 5,
  },

  description: {
    color: '#666666',
    fontSize: 14,
    fontWeight: 'normal',
    marginTop: 5,
  },
});

export default connect(
  mapStatetoProps,
  mapDispatchToProps,
)(VdoGroup);
