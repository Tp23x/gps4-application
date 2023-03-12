import { createMaterialTopTabNavigator } from 'react-navigation-tabs';

import { Home, Settings, Vdos } from '../../screens';
import { tabOptions } from '../../utils/options';

const AppStack = createMaterialTopTabNavigator(
  { Home, Settings, Vdos },
  tabOptions
);

export default AppStack;
