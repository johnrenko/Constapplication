// @flow

import React from 'react'
import { ScrollView, Text, KeyboardAvoidingView } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import { Metrics } from '../Themes'
// external libs
import Icon from 'react-native-vector-icons/FontAwesome'
import Animatable from 'react-native-animatable'
import { SocialIcon } from 'react-native-elements'
import { Actions as NavigationActions } from 'react-native-router-flux'
import Auth0Lock from 'react-native-lock'
import Auth0 from 'auth0-react-native'
import * as firebase from 'firebase'
import { Button } from 'react-native-elements'

// Styles
import styles from './Styles/LogInStyle'

// I18n
import I18n from 'react-native-i18n'

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAJO4FTAqReHONa3n4FvNo9R9u8RghAZJc",
    authDomain: "museumlisting.firebaseapp.com",
    databaseURL: "https://museumlisting.firebaseio.com",
    storageBucket: "museumlisting.appspot.com",
    messagingSenderId: "968555127105"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

class LogIn extends React.Component {
  componentDidMount() {
    const lock = new Auth0Lock({
      clientId: 'LShnQxjBKHw5zi7dOjs56lEuIaN0J7hT', 
      domain: 'johnrenko.eu.auth0.com'
    });
    lock.show({}, (err, profile, token) => {
      if (err) {
        console.log(err);
        return;
      }
      const options = {
          id_token : token.idToken,
          api : 'firebase',
          scope : 'openid name email displayName',
          target: 'LShnQxjBKHw5zi7dOjs56lEuIaN0J7hT'
      };
        const auth0 = new Auth0({
          domain:       'johnrenko.eu.auth0.com',
          clientID:     'JgHeQwYZvgF5yoeMNQ8KWgg23DUzCTRI',
          callbackURL:  'http://google.fr',
          responseType: 'token'
        });
      auth0.getDelegationToken(options, function(err, result) {

        if(!err) {
          // Exchange the delegate token for a Firebase auth token
          firebase.auth().signInWithCustomToken(result.id_token).catch(function(error) {
            console.log(error);
          });
        }
      });
      firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
          const uid = user.uid;
          const firebase_user_ref = database.ref('users/');
          firebase_user_ref.push({
            "text": uid
          });

      } else {
          const firebase_user_ref = database.ref('users/');
          firebase_user_ref.push({
            "text": "test"
          });
        }
      });
    });
  }

  onPress() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
          const uid = user.uid;

      } else {
          const firebase_user_ref = database.ref('users/');
          firebase_user_ref.push({
            "text": "I'm logged in!",
            "date": new Date().getTime(),
          });
      }
    });
  }


  render () {
    return (
      <ScrollView style={styles.container}>
        <KeyboardAvoidingView behavior='position'>
          <Button
            title='BUTTON' onPress={this.onPress()} />
        </KeyboardAvoidingView>
      </ScrollView>
    )
  }

}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LogIn)
