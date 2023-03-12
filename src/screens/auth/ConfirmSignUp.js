/* eslint-disable react/prop-types */
import React from 'react';

import {
  Container,
  TextInput,
  Text,
  Button,
  Centered,
} from '../../shared/styledComponents';
import { colors, placeholders, routes, buttons } from '../../shared/constants';

import { connect } from 'react-redux';
import trans from '../../shared/lang';
import { mapStatetoProps, mapDispatchToProps } from '../../store/store';

const ConfirmSignUp = ({ navigation: { navigate } }) => (
  <Container>
    <Centered>
      <TextInput placeholder={placeholders.code} keyboardType="number-pad" />
    </Centered>
    <Centered>
      <Button onPress={() => navigate(routes.app)}>
        <Text color={colors.bright}>{buttons.confirm}</Text>
      </Button>
      <Button>
        <Text color={colors.bright}>{buttons.resend}</Text>
      </Button>
    </Centered>
  </Container>
);


export default connect(mapStatetoProps, mapDispatchToProps)(ConfirmSignUp);