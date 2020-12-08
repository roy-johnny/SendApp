import React, {Component} from 'react';
import {
  Alert,
  Button,
  TextInput,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import ConfirmGoogleCaptcha from 'react-native-recaptcha-v2';
import storage from './storage';
import Icon from 'react-native-vector-icons/FontAwesome';

class Login extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      password: null,
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
        fetch(baseUrl + 'applogin', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            'g-recaptcha-response': event.nativeEvent.data,
            email: this.state.email,
            pass: this.state.password,
          }),
        })
          .then((response) => response.text())
          .then((data) => {
            if (data === 'wrong pass') {
              Alert.alert('Warning', 'Wrong password or email address.');
              return;
            } else if (data === 'wrong recaptcha') {
              alert('Recaptcha challenge failed. Please try again.');
              return;
            }
            email = this.state.email;
            token = data;
            storage.save({
              key: 'email',
              data: email,
            });
            storage.save({
              key: 'token',
              data: token,
            });
            Alert.alert('Success', 'Login successfully.');
            this.props.navigation.goBack();
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
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
            onChangeText={(password) => this.setState({password})}
            placeholder={'Password'}
            secureTextEntry={true}
            style={styles.input}
          />
          <Button
            title={'Login'}
            style={styles.input}
            onPress={() => {
              this.captchaForm.show();
            }}
          />
          <Text> </Text>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Reset')}>
            <Text style={{color: 'blue', textDecorationLine: 'underline'}}>Forget password?</Text>
          </TouchableOpacity>
          <Text> </Text>
          <Button
            title={'Sign up'}
            color={'#28a745'}
            style={styles.input}
            onPress={() => this.props.navigation.navigate('Signup')}
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
