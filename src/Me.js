import React, {Component} from 'react';
import {
  Alert,
  Button,
  TextInput,
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';
import storage from './storage';
import {validate} from './global';

class Me extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      token: token,
      email: email,
      loaded: false,
      password: null,
      newpass1: null,
      newpass2: null,
    };
  }

  update = () => {
    if (!this.state.email || this.state.email === '') {
      return alert('Please input email address!');
    }
    if (!validate(this.state.email)) {
      return alert('Please input valid email address!');
    }
    if (!this.state.password) {
      return alert('Please input your original password!');
    }
    if (this.state.password === '') {
      return alert('Please input your original password!');
    }
    if (this.state.newpass1 !== this.state.newpass2) {
      return alert('New passwords are different!');
    }
    fetch(baseUrl + 'appsetting', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        originemail: email,
        token: token,
        email: this.state.email,
        oldpass: this.state.password,
        pass: this.state.newpass1,
        pass2: this.state.newpass2,
      }),
    })
      .then((response) => response.text())
      .then((data) => {
        if (data === 'bad session') {
          email = null;
          token = null;
          storage.remove({key: 'email'});
          storage.remove({key: 'token'});
          this.setState({password: null, newpass1: null, newpass2: null});
          alert('Your session was time out. Please login again.');
          return this.props.navigation.navigate('Login');
        } else if (data === 'wrong password') {
          alert('Wrong password.');
        } else if (data === 'invalid operation') {
          alert('New passwords are different!');
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
          storage.save({
            key: 'email',
            data: email,
          });
          Alert.alert('Success', 'Account updated successfully.');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  remove = () => {
    fetch(baseUrl + 'appdelete', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        token: token,
        oldpass: this.state.password,
      }),
    })
      .then((response) => response.text())
      .then((data) => {
        if (data === 'bad session') {
          email = null;
          token = null;
          storage.remove({key: 'email'});
          storage.remove({key: 'token'});
          this.setState({password: null, newpass1: null, newpass2: null});
          alert('Your session was time out. Please login again.');
          return this.props.navigation.navigate('Login');
        } else if (data === 'wrong password') {
          this.setState({password: null});
          alert('Wrong password.');
        } else {
          email = null;
          token = null;
          storage.remove({key: 'email'});
          storage.remove({key: 'token'});
          this.setState({password: null, newpass1: null, newpass2: null});
          Alert.alert('Success', 'Your account has been deleted successfully.');
          this.props.navigation.goBack();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  logout = () => {
    fetch(baseUrl + 'applogout', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        token: token,
      }),
    })
      .then((response) => {
        email = null;
        token = null;
        storage.remove({key: 'email'});
        storage.remove({key: 'token'});
        this.setState({password: null, newpass1: null, newpass2: null});
        Alert.alert('Success', 'Logout successfully.');
        this.props.navigation.goBack();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  refresh = () => {
    fetch(baseUrl + 'apponline', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        token: token,
      }),
    })
      .then((response) => response.text())
      .then((text) => {
        if (text === 'no') {
          email = null;
          token = null;
          storage.remove({key: 'email'});
          storage.remove({key: 'token'});
          this.setState({email: null, token: null});
          alert('Your session has time out. Please login again.');
          this.props.navigation.navigate('Login');
        } else {
          this.setState({
            loaded: true,
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  init = () => {
    this.setState({email: email, token: token});
    if (token) {
      this.refresh();
    } else {
      this.setState({loaded: true});
    }
  };

  componentDidMount() {
    this.props.navigation.addListener('blur', () => {
      this.setState({loaded: false});
    });
    this.props.navigation.addListener('focus', () => {
      this.init();
    });
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
        }}>
        {this.state.loaded ? (
          this.state.token ? (
            <View>
              <TextInput
                ref="email"
                onChangeText={(email) => this.setState({email})}
                placeholder={'Email'}
                value={this.state.email}
                style={styles.input}
              />
              <TextInput
                ref="password"
                onChangeText={(password) => this.setState({password})}
                placeholder={'Password'}
                value={this.state.password}
                secureTextEntry={true}
                style={styles.input}
              />
              <TextInput
                ref="newpass1"
                onChangeText={(newpass1) => this.setState({newpass1})}
                placeholder={'New password'}
                value={this.state.newpass1}
                secureTextEntry={true}
                style={styles.input}
              />
              <TextInput
                ref="newpass2"
                onChangeText={(newpass2) => this.setState({newpass2})}
                placeholder={'Confirm new password'}
                value={this.state.newpass2}
                secureTextEntry={true}
                style={styles.input}
              />
              <Button
                title={'Update and Save'}
                style={styles.input}
                onPress={this.update.bind(this)}
              />
              <Text> </Text>
              <Button
                title={'Delete account'}
                color={'red'}
                style={styles.input}
                onPress={() => {
                  if (!this.state.password) {
                    return alert('Please input your original password!');
                  }
                  Alert.alert(
                    'Warning',
                    'Are you sure you want to delete your account? This operation cannot be undone. Please note your shares will not be deleted before expiring. If you want to delete your shares, please go to Shares page to delete them first.',
                    [
                      {text: 'Yes', onPress: this.remove.bind(this)},
                      {text: 'No', onPress: () => {}},
                    ],
                  );
                }}
              />
              <Text> </Text>
              <Button
                title={'Logout'}
                color={'#28a745'}
                style={styles.input}
                onPress={this.logout.bind(this)}
              />
            </View>
          ) : (
            <View style={{width: '80%'}}>
              <Button
                style={styles.button}
                color={'#17a2b8'}
                title={'Log in / Sign up'}
                onPress={() => this.props.navigation.navigate('Login')}
              />
            </View>
          )
        ) : (
          <ActivityIndicator size={'large'} color={'gray'} animating={true} />
        )}
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

export default Me;
