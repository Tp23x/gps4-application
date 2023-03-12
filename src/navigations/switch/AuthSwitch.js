import { createSwitchNavigator } from 'react-navigation';

import {
  SignIn,
  SignUp,
  ForgetPassword,
  ConfirmPassword,
  ConfirmSignUp,
} from '../../screens';

const AuthSwitch = createSwitchNavigator({
  SignIn,
  SignUp,
  ConfirmSignUp,
  ForgetPassword,
  ConfirmPassword,
});

export default AuthSwitch;
