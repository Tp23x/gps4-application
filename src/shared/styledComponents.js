import styled from 'styled-components/native';
import { Dimensions } from 'react-native';
import { colors } from './colors/';

const { width } = Dimensions.get('screen');

export const Container = styled.SafeAreaView.attrs(props => ({
  style: props.style
}))`
  flex: 1;
  align-items: center;
  justify-content: space-between;
  background-color: ${colors.creamy};
`;

export const Centered = styled.View.attrs(props => ({
  style: props.style
}))`
  align-items: center;
  justify-content: center;
  
`;

export const FlexCentered = styled(Centered).attrs(props => ({
  style: props.style
}))`
  flex: 1;
`;

export const TextInput = styled.TextInput.attrs(props => ({
  autoCorrect: false,
  autoCapitalize: 'none',
  returnKeyType: 'done',
  placeholder: props.placeholder,
  secureTextEntry: props.password,
  style: props.style
}))`
  font-size: 18px;
  border-color: ${colors.bright};
  border-width: 1px;
  border-radius: 4px;
  height: 55px;
  width: ${width * 0.9}px;
  padding: 0px;
  padding-left: 24px;
  margin-bottom: 0px;
  margin-top: 10px;
`;

export const Button = styled.TouchableOpacity.attrs(props => ({
  style: props.style
}))`
  background-color: ${colors.blue};
  width: ${width * 0.9}px;
  height: 55px;
  padding: 16px;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  margin-top: 16px;
`;

export const Text = styled.Text`
  font-size: ${props => (props.header ? '28px': '18px')};
  
  color: ${props => (props.color ? props.color : colors.dark)};
  ${props => 
    props.header ?
      `font-weight: bold;
      text-transform: capitalize;`:
      `font-weight: 500`
  };
`;


export const Spacer = styled.View`
  ${props => (
    props.small ? 
    `padding: 5px; margin: 5px;`:
    (
      props.large ? 
      `padding: 15px; margin: 15px;`:
      `padding: 10px; margin: 10px;`
    )
  )}
`;