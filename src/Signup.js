import React, {Component} from 'react';
import {Alert, Button, TextInput, View, StyleSheet, Text} from 'react-native';
import ConfirmGoogleCaptcha from 'react-native-recaptcha-v2';
import {validate} from './global';

class Signup extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      pass1: null,
      pass2: null,
    };
  }

  componentDidMount() {
    if (token) {
      this.props.navigation.goBack();
    }
  }

  onMessage = (event) => {
    if (event && event.nativeEvent.data) {
      if (['cancel', 'error', 'expired'].includes(event.nativeEvent.data)) {
        this.captchaForm.hide();
      } else {
        this.captchaForm.hide();
        fetch(baseUrl + 'appsignup', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            'g-recaptcha-response': event.nativeEvent.data,
            email: this.state.email,
            pass: this.state.pass1,
          }),
        })
          .then((response) => response.text())
          .then((data) => {
            if (data === 'db error') {
              alert('The server is under maintenance. Please try again later.');
            } else if (data === 'wrong recaptcha') {
              alert('Recaptcha challenge failed. Please try again.');
            } else if (data === 'invalid email') {
              alert('This email has been used.');
            } else {
              email = data;
              this.setState({
                email: data,
                password: null,
                newpass1: null,
                newpass2: null,
              });
              Alert.alert('Success', 'Sign up successfully.');
              this.props.navigation.goBack();
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  };

  signup = () => {
    if (!this.state.email || this.state.email === '') {
      return alert('Please input email address!');
    }
    if (!validate(this.state.email)) {
      return alert('Please input valid email address!');
    }
    if (!this.state.pass1 || this.state.pass1 === '') {
      return alert('Please input password!');
    }
    if (this.state.pass1 !== this.state.pass2) {
      return alert('Passwords are different!');
    }
    this.captchaForm.show();
  };

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ConfirmGoogleCaptcha
          ref={(_ref) => (this.captchaForm = _ref)}
          siteKey={siteKey}
          baseUrl={baseUrl}
          languageCode="en"
          onMessage={this.onMessage}
        />
        <View>
          <TextInput
            ref="email"
            onChangeText={(email) => this.setState({email})}
            placeholder={'Email'}
            style={styles.input}
          />
          <TextInput
            ref="password"
            onChangeText={(pass1) => this.setState({pass1})}
            placeholder={'Password'}
            secureTextEntry={true}
            style={styles.input}
          />
          <TextInput
            ref="Comfirm Passowrd"
            onChangeText={(pass2) => this.setState({pass2})}
            placeholder={'Password'}
            secureTextEntry={true}
            style={styles.input}
          />
          <Button
            title={'Sign up'}
            style={styles.input}
            onPress={this.signup.bind(this)}
          />
          <Text> </Text>
          <Button
            style={styles.input}
            color={'#D0D3D4'}
            title={'Login'}
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

export default Signup;
