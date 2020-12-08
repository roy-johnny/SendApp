import React, {Component} from 'react';
import {Alert, Button, TextInput, View, StyleSheet, Text} from 'react-native';
import ConfirmGoogleCaptcha from 'react-native-recaptcha-v2';
import storage from './storage';

class Login extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
    };
  }

  componentDidMount() {
    if (token) {
      this.props.navigation.goBack();
    }
  }

  reset() {
    if (this.state.email.length === 0) {
      alert('Please input email address of your account.');
      return;
    }
    fetch(baseUrl + 'lost-password', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.email,
      }),
    })
      .then((response) => response.text())
      .then((data) => {
        if (data === 'no email') {
          alert('There is no account this email associated with.');
          return;
        }
        Alert.alert('Success', 'Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder.');
        this.props.navigation.goBack();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View>
          <TextInput
            ref="email"
            onChangeText={(email) => this.setState({email})}
            placeholder={'Account email'}
            style={styles.input}
          />
          <Button
            title={'Reset password'}
            style={styles.input}
            onPress={this.reset.bind(this)}
          />
          <Text> </Text>
          <Button
            style={styles.input}
            color={'#D0D3D4'}
            title={'Back'}
            titleColor={'black'}
            onPress={() => this.props.navigation.goBack()}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
});

export default Login;
