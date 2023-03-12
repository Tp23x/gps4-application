/* eslint-disable react/prop-types */
import React, { useEffect, useCallback } from 'react';
import { AsyncStorage, View, Image } from 'react-native';

// import { routes } from '../../shared/routes';
import Spinner from '../../components/Spinner';

import {
    Container,
    Centered,
    Text,
    Button,
    colors,
    routes
} from '../../shared';


import * as firebase from 'firebase';
import 'firebase/auth';
import { NavigationEvents, NavigationActions } from 'react-navigation';
import { Spacer } from '../../shared/styledComponents';

import { SliderBox } from 'react-native-image-slider-box';

import { connect } from 'react-redux';
import trans from '../../shared/lang';
import { mapStatetoProps, mapDispatchToProps } from '../../store/store';

class Intro extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            images: [
                require('../../../assets/images/introduction.png'),
                require('../../../assets/images/introduction2.png'),
                require('../../../assets/images/introduction3.png')
            ],
            introductionImage: null
        }
    }

    componentDidMount(){
        this.setState(prevState => {
            introductionImage:  require('../../../assets/images/introduction2.png')
        });
    }

     async toGetStarted(){
        let user = this.props.store.user;
        if( false ) {
            return this.props.navigation.navigate(routes.goal);
        } else {
            return this.props.navigation.navigate(routes.intro2);
        }
    }

    async getStarted(){
        console.log( 'calling togetStart()' );
        await this.toGetStarted()
            .then(() => {
                    console.log( 'togetstarted completed!' );
                }
            );
    }

    render(){
        const { navigate } = this.props.navigation;
        return (
            <Container>
    
                <Spacer />
                <Centered>
                    <Text header>{trans('introduction', this.props.store.lang)}</Text>
                    <Text>Lorem ipsum dolor sit amet</Text>
                </Centered>
    
                <Centered style={{flex:1}}>
                    <Image source={require('../../../assets/images/introduction2.png')} style={{flex:1}} />
                </Centered>

                <Centered>
                    <Button onPress={() => this.getStarted()}>
                        <Text color={colors.bright}>{trans('getStated', this.props.store.lang)}</Text>
                    </Button>
                </Centered>
                <Centered>
                    <Text>Lorem ipsum dolor sit amet</Text>
                </Centered>
    
                <Spacer />
    
            </Container>
        );
    }
}


export default connect(mapStatetoProps, mapDispatchToProps)(Intro);
