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
const lock = new Auth0Lock({
  clientId: 'LShnQxjBKHw5zi7dOjs56lEuIaN0J7hT', 
  domain: 'johnrenko.eu.auth0.com',
  auth: {
    responseType: 'token',
    params: {scope: 'openid name email'}
  }
});
const auth0 = new Auth0({
  domain:       'johnrenko.eu.auth0.com',
  clientID:     'LShnQxjBKHw5zi7dOjs56lEuIaN0J7hT',
  responseType: 'token'
});


class LogIn extends React.Component {
  state = {
    loggedIn: false,
    userProfile: {},
    userToken: {},
    delegationToken: {}
  };

  constructor(){
    super();
    this.onPress = this.onPress.bind(this);
  }

  login() {

    lock.show({}, (err, profile, token) => {
      if (err) {
        console.log(err);
        return;
      };

      this.setState({
        userProfile: profile,
        userToken: token.idToken,
        loggedIn: false
      });

      const options = {
        id_token : this.state.userToken,
        api : 'firebase',
        scope : 'openid',
        target: 'LShnQxjBKHw5zi7dOjs56lEuIaN0J7hT'
      };

      auth0.getDelegationToken(options, function(err, result) {
        firebase.auth().signInWithCustomToken(result.id_token).catch(function(error) {
          console.log(error);
        });
      });

      firebase.database().ref('users').set({
        userId: this.state.userProfile.userId
      });
    });
  }

  onPress() {
    firebase.auth().signOut().then(function() {
      console.log("Logged Out");
    }, function(error) {
    // An error happened.
    });
    this.setState({
      loggedIn: true
    });
  }

  render () {
    {this.state.loggedIn ? this.login() : null}
    

    return (
      <ScrollView style={styles.container}>
        <KeyboardAvoidingView behavior='position'>
          <Button
            title='LogOut' onPress={this.onPress} />
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
