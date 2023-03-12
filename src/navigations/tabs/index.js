import { createBottomTabNavigator } from 'react-navigation-tabs';

import { Home, Goal, Settings } from '../../screens';


const tabNav = createBottomTabNavigator(
  {
    Home,
    Settings
  }
);

export default tabNav;
