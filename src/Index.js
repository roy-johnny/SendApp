import React, {Component} from 'react';
import {
  Button,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import DocumentPicker from 'react-native-document-picker';
import * as RNFS from 'react-native-fs';
import ConfirmGoogleCaptcha from 'react-native-recaptcha-v2';
import Clipboard from '@react-native-community/clipboard';
import {checklink} from './global';
import Icon from 'react-native-vector-icons/FontAwesome';
import storage from './storage';

class Index extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0,
      files: [],
      dltime: '1',
      date: '1',
      maxnum: 1,
      maxsize: 0,
      link: '',
      token: token,
      uploading: false,
    };
  }

  removeItem(fileno) {
    for (var i = 0; i < this.state.files.length; i++) {
      if (this.state.files[i].counter === fileno) {
        var array = this.state.files;
        array.splice(i, 1);
        this.setState({
          files: array,
        });
        break;
      }
    }
  }

  pickfile = async () => {
    try {
      const res = await DocumentPicker.pick({});
      if (res.size > this.state.maxsize * 1024 * 1024) {
        alert(
          'The size of each file should be less than ' +
            this.state.maxsize +
            'MB!',
        );
        return;
      }
      for (var i = 0; i < this.state.files.length; i++) {
        if (this.state.files[i].uri === res.uri) {
          alert('No need to upload the same file twice.');
          return;
        }
      }
      RNFS.readFile(res.uri, 'base64')
        .then((o) => {
          if (o) {
            var filesize;
            if (res.size > 1024 * 1024) {
              filesize = (res.size / 1024 / 1024).toFixed(2).toString() + 'MB';
            } else {
              filesize = (res.size / 1024).toFixed(2).toString() + 'KB';
            }
            this.setState({
              files: [
                ...this.state.files,
                {
                  name: res.name,
                  data: 'data:' + res.type + ';base64,' + o,
                  size: res.size,
                  counter: this.state.counter.toString(),
                  filesize: filesize,
                  uri: res.uri,
                },
              ],
              counter: this.state.counter + 1,
            });
          }
        })
        .catch((err) => {
          console.log(err.message, err.code);
        });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  pastelink = async () => {
    const text = await Clipboard.getString();
    if (checklink(text)) {
      this.setState({link: text});
    }
  };

  componentDidMount() {
    storage
      .load({key: 'token'})
      .then((ret) => {
        token = ret;
      })
      .catch((err) => {});
    storage
      .load({key: 'email'})
      .then((ret) => {
        email = ret;
      })
      .catch((err) => {});
    fetch(baseUrl + 'maxnum')
      .then((response) => response.json())
      .then((json) => {
        this.setState({maxnum: parseInt(json)});
      });
    fetch(baseUrl + 'maxsize')
      .then((response) => response.json())
      .then((json) => {
        this.setState({maxsize: parseInt(json)});
      });
    this.pastelink();
    this.props.navigation.addListener('focus', () => {
      this.pastelink();
      this.setState({token: token});
    });
  }

  onMessage = (event) => {
    if (event && event.nativeEvent.data) {
      if (['cancel', 'error', 'expired'].includes(event.nativeEvent.data)) {
        this.captchaForm.hide();
      } else {
        this.captchaForm.hide();
        this.setState({uploading: true});
        fetch(baseUrl + 'appupload', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            'g-recaptcha-response': event.nativeEvent.data,
            data: this.state.files,
            dltime: this.state.dltime,
            datetime: this.state.date,
            email: email,
            token: token,
          }),
        })
          .then((response) => response.json())
          .then((json) => {
            json.dltime = this.state.dltime;
            json.date = this.state.date;
            json.num = this.state.files.length;
            this.setState({
              counter: 0,
              files: [],
              dltime: '1',
              date: '1',
              uploading: false,
            });
            this.props.navigation.navigate('Success', json);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  };

  render() {
    var files = [];
    for (var i = 0; i < this.state.files.length; i++) {
      files.push(
        <View
          style={[
            {
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginBottom: '3%',
              alignItems: 'center',
            },
            styles.width,
          ]}
          key={i}>
          <Text style={{width: '67%'}}>{this.state.files[i].name}</Text>
          <Text style={{width: '20%', marginRight: '2%'}}>
            {this.state.files[i].filesize}
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: '#ffc107',
              paddingVertical: 5,
              paddingHorizontal: '3%',
              borderRadius: 5,
            }}
            onPress={this.removeItem.bind(this, this.state.files[i].counter)}>
            <Icon name="remove" size={15} color="white" />
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
        <ConfirmGoogleCaptcha
          ref={(_ref) => (this.captchaForm = _ref)}
          siteKey={siteKey}
          baseUrl={baseUrl}
          languageCode="en"
          onMessage={this.onMessage}
        />
        {this.state.files.length === 0 && (
          <View style={[styles.width, {marginBottom: 10}]}>
            <Button
              style={styles.button}
              color={'green'}
              title={'Scan QR code'}
              onPress={() => this.props.navigation.navigate('Scan')}
            />
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginTop: 10,
              }}>
              <TextInput
                ref="link"
                onChangeText={(link) => this.setState({link})}
                value={this.state.link}
                placeholder={'Paste share link here'}
                style={{
                  width: '90%',
                  height: 36,
                  padding: 10,
                  borderWidth: 1,
                  borderColor: 'black',
                  borderTopLeftRadius: 5,
                  borderBottomLeftRadius: 5,
                }}
              />
              <TouchableOpacity
                style={{
                  width: '10%',
                  height: 36,
                  backgroundColor: '#ffc107',
                  borderTopRightRadius: 5,
                  borderBottomRightRadius: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  if (this.state.link !== '') {
                    this.props.navigation.navigate('Get', {
                      link: this.state.link,
                    });
                  } else {
                    alert('Please input a share link.');
                  }
                }}>
                <Text style={{color: 'white'}}>GO</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <Text> </Text>
        <View>{files}</View>
        {this.state.files.length < this.state.maxnum && (
          <View style={[styles.width, {marginBottom: 6}]}>
            <Button
              title={'Select file to share'}
              onPress={this.pickfile.bind(this)}
            />
          </View>
        )}
        <View style={[{flexDirection: 'row', flexWrap: 'wrap'}, styles.width]}>
          <Text style={styles.text}>Expires after</Text>
          <Picker
            selectedValue={this.state.dltime}
            style={{height: 20, width: 160}}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({dltime: itemValue})
            }>
            <Picker.Item label="1 download" value="1" />
            <Picker.Item label="2 downloads" value="2" />
            <Picker.Item label="3 downloads" value="3" />
            <Picker.Item label="4 downloads" value="4" />
            <Picker.Item label="5 downloads" value="5" />
            <Picker.Item label="6 downloads" value="6" />
          </Picker>
          <Text style={styles.text}>or</Text>
          <Picker
            selectedValue={this.state.date}
            style={{height: 20, width: 140}}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({date: itemValue})
            }>
            <Picker.Item label="1 day" value="1" />
            <Picker.Item label="2 days" value="2" />
            <Picker.Item label="3 days" value="3" />
            <Picker.Item label="4 days" value="4" />
            <Picker.Item label="5 days" value="5" />
            <Picker.Item label="6 days" value="6" />
          </Picker>
        </View>
        {this.state.files.length > 0 && (
          <View style={styles.width}>
            <Text> </Text>
            {this.state.uploading ? (
              <View
                style={{
                  backgroundColor: '#D0D3D4',
                  height: 36,
                  borderRadius: 3,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ActivityIndicator
                  size={'small'}
                  color={'white'}
                  animating={true}
                  style={{width: 15, height: 15}}
                />
              </View>
            ) : (
              <Button
                style={styles.button}
                color={'#28a745'}
                title={'Share'}
                onPress={() => {
                  this.captchaForm.show();
                }}
              />
            )}
          </View>
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
});

export default Index;
