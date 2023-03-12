/* eslint-disable react/prop-types */
import React from 'react';

import {
  Container,
  Centered,
  TextInput,
  Button,
  Text,
  colors,
  placeholders,
  buttons,
} from '../../shared';

import { connect } from 'react-redux';
import trans from '../../shared/lang';
import { mapStatetoProps, mapDispatchToProps } from '../../store/store';

const ConfirmPassword = () => (
  <Container>
    <Centered>
      <TextInput placeholder={placeholders.newPassword} password />
      <TextInput placeholder={placeholders.code} keyboardType="number-pad" />
    </Centered>
    <Centered>
      <Button>
        <Text color={colors.bright}>{buttons.confirm}</Text>
      </Button>
    </Centered>
  </Container>
);


export default connect(mapStatetoProps, mapDispatchToProps)(ConfirmPassword);