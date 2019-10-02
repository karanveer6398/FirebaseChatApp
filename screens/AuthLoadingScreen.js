import React from 'react';
import {ActivityIndicator,AsyncStorage, StatusBar,View,} from 'react-native';
import User from '../User';
import firebase from 'firebase';


export default class AuthLoadingScreen extends React.Component {
  componentDidMount() {
    this._bootstrapAsync();
  }

componentWillMount(){
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyC8_Ppg4AUFp0Uq0rqQ4zkUuNFHmOdn3oI",
    authDomain: "fir-chat-6b9c5.firebaseapp.com",
    databaseURL: "https://fir-chat-6b9c5.firebaseio.com",
    projectId: "fir-chat-6b9c5",
    storageBucket: "fir-chat-6b9c5.appspot.com",
    messagingSenderId: "374871888541",
    appId: "1:374871888541:web:c53a247b8f26d72d0eba74",
    measurementId: "G-P6K0FFLFKV"
  };
  firebase.initializeApp(firebaseConfig);
}

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
   User.phone = await AsyncStorage.getItem('userPhone');

    this.props.navigation.navigate(User.phone ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}