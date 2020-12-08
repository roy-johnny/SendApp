import React, {Component} from 'react';
import {Alert, Button, View, Text, StyleSheet} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Clipboard from '@react-native-community/clipboard';

class Success extends Component<{}> {
  constructor(props) {
    super(props);
    this.link = baseUrl + 'share/' + this.props.route.params.pid;
  }

  cancel = () => {
    fetch(baseUrl + 'cancel', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pid: this.props.route.params.pid,
        token: this.props.route.params.token,
      }),
    })
      .then(() => {
        Alert.alert('Success', 'Delete successfully.');
        this.props.navigation.goBack();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View style={{width: '80%'}}>
          {this.props.route.params.dltime && (
            <Text style={{fontSize: 20}}>
              The link to your{' '}
              {this.props.route.params.num > 1 ? 'files ' : 'file'}
              will expire after {this.props.route.params.dltime}{' '}
              {this.props.route.params.dltime > 1 ? 'downloads' : 'download'} or{' '}
              {this.props.route.params.date}{' '}
              {this.props.route.params.date > 1 ? 'days.' : 'day.'}
            </Text>
          )}
          <Text>
            Your friend can scan this QR code to download the{' '}
            {this.props.route.params.num > 1 ? 'files' : 'file'} you shared:
          </Text>
          <Text> </Text>
          <View style={{alignItems: 'center'}}>
            <QRCode value={this.link} />
          </View>
          <Text> </Text>
          <Text>
            Or you can copy and share the link to share your{' '}
            {this.props.route.params.num > 1 ? 'files:' : 'file:'}
          </Text>
          <Text> </Text>
          <Text>{this.link}</Text>
          <Text> </Text>
          <Button
            title={'Copy to clipboard'}
            onPress={() => {
              Clipboard.setString(this.link);
              Alert.alert('Success', 'Copied the link to clipboard.');
            }}
          />
          <Text> </Text>
          <Button
            color={'gray'}
            title={'Delete'}
            onPress={() => {
              Alert.alert(
                'Warning',
                'Are you sure you want to delete this share? This operation cannot be undone.',
                [
                  {text: 'Yes', onPress: this.cancel.bind(this)},
                  {text: 'No', onPress: () => {}},
                ],
              );
            }}
          />
          <Text> </Text>
          <Button
            color={'#28a745'}
            title={'Back'}
            onPress={() => {
              this.props.navigation.goBack();
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({});

export default Success;
