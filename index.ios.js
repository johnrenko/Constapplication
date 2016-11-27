// @flow

import './App/Config/ReactotronConfig'
import { AppRegistry } from 'react-native'
import * as firebase from 'firebase';
import App from './App/Containers/App'

AppRegistry.registerComponent('Constapplication', () => App)
