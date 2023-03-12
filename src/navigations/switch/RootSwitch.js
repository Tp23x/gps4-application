import { createSwitchNavigator } from 'react-navigation';
import { Transition } from 'react-native-reanimated';

import { Loading } from '../../screens';
import AuthSwitch from './AuthSwitch';
import AppSwitch from './AppSwitch';

const RootSwitch = createSwitchNavigator(
    {
        Loading,
        App: AppSwitch,
        Auth: AuthSwitch,
    },
    {
        transition: (
            <Transition.Together>
                <Transition.Out
                    type='slide-bottom'
                    durationMs={400}
                    interpolation='easeIn'
                />
                <Transition.In
                    type='fade'
                    durationMs={500}
                />
            </Transition.Together>
        )
    }
);

export default RootSwitch;
