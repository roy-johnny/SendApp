import React, {Component} from 'react';
import {
  Button,
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Clipboard from '@react-native-community/clipboard';
import storage from './storage';

class Index extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      loaded: false,
    };
  }

  removeItem(i) {
    let files = this.state.files;
    files[i].removing = true;
    this.setState({files: files});
    fetch(baseUrl + 'cancel', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pid: this.state.files[i].pid,
        token: this.state.files[i].token,
      }),
    })
      .then(this.refresh)
      .catch((error) => {
        console.error(error);
      });
  }

  refresh = () => {
    fetch(baseUrl + 'apphome', {
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
      .then((response) => response.json())
      .then((json) => {
        if (json.fail) {
          email = null;
          token = null;
          storage.remove({key: 'email'});
          storage.remove({key: 'token'});
          this.setState({files: []});
          alert('Your session has time out. Please login again.');
          this.props.navigation.navigate('Login');
        } else {
          this.setState({
            files: json.project_list,
            loaded: true,
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  init = () => {
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

  copyToClipboard = (i) => {
    if (!this.state.files[i].removing) {
      let link = baseUrl + 'share/' + this.state.files[i].pid;
      Clipboard.setString(link);
      Alert.alert('Success', 'Copied ' + link + ' to clipboard.');
    }
  };

  success = (i) => {
    if (!this.state.files[i].removing) {
      this.props.navigation.navigate('Success', this.state.files[i]);
    }
  };

  alertremove = (i) => {
    if (!this.state.files[i].removing) {
      Alert.alert(
        'Warning',
        'Are you sure you want to delete this share? This operation cannot be undone.',
        [
          {text: 'Yes', onPress: this.removeItem.bind(this, i)},
          {text: 'No', onPress: () => {}},
        ],
      );
    }
  };

  get = (i) => {
    this.props.navigation.navigate('Get', {
      link: baseUrl + 'share/' + this.state.files[i].pid,
    });
  };

  render() {
    var files = [];
    for (var i = 0; i < this.state.files.length; i++) {
      files.push(
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginBottom: '3%',
            alignItems: 'center',
            width: '96%',
            marginLeft: '2%',
          }}
          key={i}>
          <TouchableOpacity
            style={{width: '48%', marginRight: '2%'}}
            onPress={this.get.bind(this, i)}>
            <Text>{baseUrl + 'share/' + this.state.files[i].pid}</Text>
          </TouchableOpacity>
          <Text style={{width: '12%', marginRight: '2%'}}>
            {this.state.files[i].num}{' '}
            {this.state.files[i].num > 1 ? 'files' : 'file'}
          </Text>
          <TouchableOpacity
            style={[
              {
                backgroundColor: 'blue',
              },
              styles.button,
            ]}
            onPress={this.copyToClipboard.bind(this, i)}>
            <Icon name="copy" size={15} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              {
                backgroundColor: 'green',
              },
              styles.button,
            ]}
            onPress={this.success.bind(this, i)}>
            <Icon name="qrcode" size={15} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              {
                backgroundColor: '#ffc107',
              },
              styles.button,
            ]}
            onPress={this.alertremove.bind(this, i)}>
            {this.state.files[i].removing ? (
              <ActivityIndicator
                size={'small'}
                color={'white'}
                animating={true}
                style={{width: 9, height: 15}}
              />
            ) : (
              <Icon name="remove" size={15} color="white" />
            )}
          </TouchableOpacity>
        </View>,
      );
    }
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
        }}>
        {this.state.loaded ? (
          token ? (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text> </Text>
              <Text style={{fontSize: 20}}>
                {this.state.files.length > 0
                  ? 'Your shares'
                  : "You haven't shared anything."}
              </Text>
              <Text> </Text>
              <ScrollView style={{flex: 1}}>{files}</ScrollView>
            </View>
          ) : (
            <View style={styles.width}>
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
  text: {
    fontSize: 15,
  },
  width: {
    width: '80%',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: '4.2%',
  },
});

export default Index;
