import { colors } from '../shared';

export const tabOptions = {
  tabBarPosition: 'bottom',
  tabBarOptions: {
    indicatorStyle: {
      height: 0,
    },
    activeTintColor: colors.blue,
    inactiveTintColor: colors.dark,
    style: {
      backgroundColor: colors.bright,
    },
  },
};

export const stackOptions = (title, headerShown = true ) => ({
  title,
  headerTintColor: colors.dark,
  headerBackTitle: 'Back',
  headerStyle: {
    backgroundColor: 'white',
    borderBottomWidth: 0,
  },
  headerShown: headerShown
});

export const switchOptions = title => ({
  
});
